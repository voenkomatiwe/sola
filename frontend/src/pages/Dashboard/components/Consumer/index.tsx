import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Signer } from "@solana/web3.js";
import BN from "bn.js";
import { CalendarClock, LucideDollarSign, Users } from "lucide-react";
import { useEffect } from "react";
import { parse } from "uuid";

import { InfoCard } from "@/components/InfoCard";
import { Calendar } from "@/components/ui/calendar";
import { useConsumer } from "@/hooks/store/useConsumer";

import { Chart } from "./chart";

const DEVNET_TOKEN_ACCOUNT = "4r1YezyMmxBTG9gukMPzubVUZUAV4JYTutNVzChHSQZv";
const CONTRACT_ADDRESS = "2wivZHNNjvwWgrQEkGvv1bH9HgaWxXmfogkB24z1tsJz";

export function findContractServiceAddress(
  id: string,
  programId: PublicKey,
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("service"), parse(id)],
    programId,
  );
}

export async function createService(
  id: string,
  authority: PublicKey,
  paymentDelegate: PublicKey,
  mint: PublicKey,
  sub_price: BN,
  wallet: Signer,
) {
  const [service, bump] = findContractServiceAddress(
    id,
    new PublicKey(CONTRACT_ADDRESS),
  );
  const sender = wallet.publicKey;
  return {
    sender,
    id,
    authority,
    paymentDelegate,
    mint,
    sub_price,
    service,
    bump,
  };
  // return await this.sendSigned(
  //   this.program.methods
  //     .createService(new BN(id), authority, paymentDelegate, sub_price, bump)
  //     .accounts({
  //       sender,
  //       service,
  //       mint,
  //       systemProgram: web3.SystemProgram.programId,
  //     }),
  //   wallet,
  // );
}

export const Consumer = () => {
  const { totalSpent, mySubscriptions } = useConsumer.getState();
  const activeSubscriptions = mySubscriptions.filter(
    (el) => el.status === "processing",
  );
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const getAccountAddress = async () => {
    if (publicKey) {
      const tokens = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
      });

      const info = await connection.getTokenAccountBalance(
        new PublicKey(DEVNET_TOKEN_ACCOUNT),
      );

      console.log("here we are", info, tokens);
    }
  };
  const createSubscription = async () => {
    console.log("creating");
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
