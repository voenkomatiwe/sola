import { BN, Wallet } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { CalendarClock, LucideDollarSign, Users } from "lucide-react";
import { useEffect } from "react";
import { v4 } from "uuid";

import { InfoCard } from "@/components/InfoCard";
import { Calendar } from "@/components/ui/calendar";
import { contractAddress } from "@/config";
import { useConsumer } from "@/hooks/store/useConsumer";
import { SubscriptionAdapter } from "@/lib/contract";

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

      const serviceAdapter = new SubscriptionAdapter(
        connection,
        wallet as Wallet,
        contractAddress,
      );
      try {
        const allServices = await serviceAdapter.getSubscriptionData(
          publicKey,
          v4({
            random: new BN("153807357704477413592972126688430806559").toArray(
              "be",
            ),
          }),
        );
        console.log("here we are", allServices, tokens);
      } catch (e) {
        console.warn(e);
      }
    }
  };
  const createSubscription = async () => {
    if (publicKey && wallet) {
      // const tokenAccount = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr";
      // const serviceAdapter = new ServiceAdapter(
      //   connection,
      //   wallet as Wallet,
      //   contractAddress,
      // );

      // const createServiceTx = await serviceAdapter.createService(
      //   v4(),
      //   publicKey,
      //   new PublicKey(tokenAccount),
      //   new BN("100"),
      // );
      // console.log(createServiceTx, "creating service");

      const subscriptionAdapter = new SubscriptionAdapter(
        connection,
        wallet as Wallet,
        contractAddress,
      );

      const tx = await subscriptionAdapter.activateSubscription(
        v4({
          random: new BN("153807357704477413592972126688430806559").toArray(
            "be",
          ),
        }),
      );
      console.log(tx);
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
