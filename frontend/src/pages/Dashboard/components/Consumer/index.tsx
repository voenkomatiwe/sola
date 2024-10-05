import {
  AnchorProvider,
  BN,
  Program,
  Wallet,
  utils,
  web3,
} from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { SignerWalletAdapterProps } from "@solana/wallet-adapter-base";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { CalendarClock, LucideDollarSign, Users } from "lucide-react";
import { useEffect } from "react";
import { parse, v4 } from "uuid";

import { InfoCard } from "@/components/InfoCard";
import { Calendar } from "@/components/ui/calendar";
import { contractAddress, tokenAccount, tokenAddress } from "@/config";
import { useConsumer } from "@/hooks/store/useConsumer";
import { IDL } from "@/lib/contract/idl";

import { Chart } from "./chart";

function padBuffer(buffer: Buffer | Uint8Array, targetSize: number) {
  if (!(buffer instanceof Buffer)) {
    buffer = Buffer.from(buffer);
  }

  if (buffer.byteLength > targetSize) {
    throw new RangeError(`Buffer is larger than target size: ${targetSize}`);
  }

  return Buffer.concat(
    [buffer, Buffer.alloc(targetSize - buffer.byteLength)],
    targetSize,
  );
}

function bufferFromString(str: string, bufferSize?: number) {
  const utf = utils.bytes.utf8.encode(str);

  if (!bufferSize || utf.byteLength === bufferSize) {
    return Buffer.from(utf);
  }

  if (bufferSize && utf.byteLength > bufferSize) {
    throw RangeError("Buffer size too small to fit the string");
  }

  return padBuffer(utf, bufferSize);
}

function findContractServiceAddress(
  id: string,
  programId: PublicKey,
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [bufferFromString("service"), parse(id)],
    programId,
  );
}

async function createService(
  id: string,
  authority: PublicKey,
  paymentDelegate: PublicKey,
  mint: PublicKey,
  sub_price: BN,
  sender: PublicKey,
  connection: web3.Connection,
  sendTransaction: SignerWalletAdapterProps["sendTransaction"],
  wallet: Wallet,
) {
  const [service, bump] = findContractServiceAddress(
    id,
    new PublicKey(contractAddress),
  );
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  const program = new Program(IDL, new PublicKey(contractAddress), provider);
  const allServices = await program.account.service.all();
  console.log(allServices, "allServices");
  const createServiceInstruction = await program.methods
    .createService(
      new BN(parse(id), "be"),
      authority,
      paymentDelegate,
      sub_price,
      bump,
    )
    .accounts({
      sender,
      service,
      mint,
      systemProgram: web3.SystemProgram.programId,
    })
    .instruction();
  const transferTransaction = new Transaction().add(createServiceInstruction);
  transferTransaction.feePayer = sender;
  const {
    context: { slot: minContextSlot },
    value: { blockhash, lastValidBlockHeight },
  } = await connection.getLatestBlockhashAndContext();

  const simulate = await connection.simulateTransaction(transferTransaction);
  console.log(simulate);
  const signature = await sendTransaction(transferTransaction, connection, {
    minContextSlot,
  });

  const result = await connection.confirmTransaction({
    blockhash,
    lastValidBlockHeight,
    signature,
  });
  console.log("result");

  return result;
}

export const Consumer = () => {
  const { totalSpent, mySubscriptions } = useConsumer.getState();
  const activeSubscriptions = mySubscriptions.filter(
    (el) => el.status === "processing",
  );
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const getAccountAddress = async () => {
    if (publicKey) {
      const tokens = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
      });
      const info = await connection.getTokenAccountBalance(
        new PublicKey(tokenAccount),
      );

      console.log("here we are", info, tokens);
    }
  };
  const createSubscription = async () => {
    if (publicKey && sendTransaction && wallet)
      await createService(
        v4(),
        publicKey,
        publicKey,
        new PublicKey(tokenAddress),
        new BN("333"),
        publicKey,
        connection,
        sendTransaction,
        wallet as Wallet,
      );
  };

  useEffect(() => {
    getAccountAddress();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <button onClick={createSubscription}>Create subscription</button>
        <InfoCard
          title="Total spent"
          icon={<LucideDollarSign />}
          value={totalSpent}
        />
        <InfoCard
          title="Active Subscriptions"
          icon={<Users />}
          value={activeSubscriptions.length.toString()}
        />
        <InfoCard
          title="Monthly expense"
          icon={<CalendarClock />}
          value="$13"
        />
      </div>
      <div className="flex gap-4 justify-end">
        <Chart />
        <Calendar
          mode="multiple"
          selected={[new Date()]}
          className="rounded-md border h-fit"
        />
      </div>
    </div>
  );
};
