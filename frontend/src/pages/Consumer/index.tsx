import { utils } from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import BN from "bn.js";
import { CalendarClock, LucideDollarSign, Users } from "lucide-react";
import { useEffect } from "react";
import { v4 } from "uuid";

import { InfoCard } from "@/components/InfoCard";
import { Calendar } from "@/components/ui/calendar";
import { tokens } from "@/constants/columns/tokens";
import { useAdapters } from "@/hooks/store/useAdapters";
import { useConsumer } from "@/hooks/store/useConsumer";
import { bufferFromString } from "@/lib/contract/utils";
import { formatTokenAmount } from "@/utils";

import { Chart } from "./chart";

export const Consumer = () => {
  const { mySubscriptions, setMySubscriptions, totalSpent, setTotalExpenses } =
    useConsumer((store) => store);
  const activeSubscriptions = mySubscriptions.filter((el) => el.isActive);

  const { publicKey } = useWallet();

  const { subscriptionAdapters, serviceAdapters } = useAdapters((store) => ({
    subscriptionAdapters: store.subscription,
    serviceAdapters: store.service,
  }));

  useEffect(() => {
    const func = async () => {
      try {
        if (
          !subscriptionAdapters ||
          !serviceAdapters ||
          !publicKey ||
          mySubscriptions.length
        )
          return;
        const result = await subscriptionAdapters.getAllSubscriptions();

        const parsedServices = await Promise.all(
          result
            .filter((el) => el.account.user.toString() === publicKey.toString())
            .map(async (subscription) => {
              const id = v4({
                random: new BN(
                  subscription.account.serviceId.toString(),
                ).toArray("be"),
              });
              const service = await serviceAdapters.getContractServiceData(id);
              const here = "Service name";
              const buf = Array.from(bufferFromString(here, 32));
              const buff = Buffer.from(buf);

              console.log("hehhe", service, utils.bytes.utf8.decode(buff));

              return {
                id: service.id.toString(),
                authority: service.authority.toString(),
                subscriptionPeriod: service.subscriptionPeriod.toString(),
                mint: service.mint.toString(),
                subPrice: service.subPrice.toString(),
                updatedAt: service.updatedAt.toNumber(),
                name: Buffer.from(service.name).toString(),
                url: Buffer.from(service.url).toString(),

                isActive: subscription.account.isActive,
                serviceId: subscription.account.serviceId.toString(),
                lastPayment: subscription.account.lastPayment.toNumber(),
                user: subscription.account.user.toString(),
              };
            }),
        );

        setMySubscriptions(parsedServices);
        const resultByMint = parsedServices.reduce<Record<string, string>>(
          (acc, service) => {
            const { mint, subPrice } = service;
            if (!acc[mint]) {
              acc[mint] = "0";
            }
            acc[mint] = new BN(subPrice).add(new BN(acc[mint])).toString();
            return acc;
          },
          {},
        );

        const resultArray = Object.entries(resultByMint).map(
          ([mint, value]) => {
            const { decimals, name } = tokens[mint];
            return {
              token: name,
              value: formatTokenAmount(value, decimals),
            };
          },
        );

        setTotalExpenses(resultArray);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    func();
  }, [
    publicKey,
    serviceAdapters,
    setMySubscriptions,
    subscriptionAdapters,
    setTotalExpenses,
  ]);

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
