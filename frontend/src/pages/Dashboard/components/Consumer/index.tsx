import { BN, Wallet } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { CalendarClock, LucideDollarSign, Users } from "lucide-react";
import { useEffect } from "react";
import { v4 } from "uuid";

import { InfoCard } from "@/components/InfoCard";
import { Calendar } from "@/components/ui/calendar";
import { contractAddress, tokenAccount, tokenAddress } from "@/config";
import { useConsumer } from "@/hooks/store/useConsumer";
import { ServiceAdapter } from "@/lib/contract";

import { Chart } from "./chart";

export const Consumer = () => {
  const { totalSpent, mySubscriptions } = useConsumer.getState();
  const activeSubscriptions = mySubscriptions.filter(
    (el) => el.status === "processing",
  );
  const { publicKey } = useWallet();
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
    if (publicKey && wallet) {
      const serviceAdapter = new ServiceAdapter(
        connection,
        wallet as Wallet,
        contractAddress,
      );
      console.log(publicKey, "original");
      await serviceAdapter.createService(
        v4(),
        publicKey,
        publicKey,
        new PublicKey(tokenAddress),
        new BN("333"),
      );
    }
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
