import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { CalendarClock, LucideDollarSign, Users } from "lucide-react";
import { useEffect } from "react";

import { InfoCard } from "@/components/InfoCard";
import { Calendar } from "@/components/ui/calendar";
import { useConsumer } from "@/hooks/store/useConsumer";

import { Chart } from "./chart";

const DEVNET_TOKEN_ACCOUNT = "4r1YezyMmxBTG9gukMPzubVUZUAV4JYTutNVzChHSQZv";

export const Consumer = () => {
  const { totalSpent, mySubscriptions } = useConsumer.getState();
  const activeSubscriptions = mySubscriptions.filter(
    (el) => el.status === "processing",
  );
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const getAccountAddress = async () => {
    if (publicKey) {
      const splTokenProgramId = new PublicKey(
        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      );
      const tokens = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: splTokenProgramId,
      });

      const info = await connection.getTokenAccountBalance(
        new PublicKey(DEVNET_TOKEN_ACCOUNT),
      );

      console.log("here we are", info, tokens);
    }
  };

  useEffect(() => {
    getAccountAddress();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
