import { useWallet } from "@solana/wallet-adapter-react";
import BN from "bn.js";
import { useEffect } from "react";
import { v4 } from "uuid";

import { DataTable } from "@/components/DataTable";
import { columns } from "@/constants/columns/mySubscriptions";
import { useAdapters } from "@/hooks/store/useAdapters";
import { useConsumer } from "@/hooks/store/useConsumer";
import { APP_ROUTES } from "@/routes/constants";

export const MySubscriptions = () => {
  const { publicKey } = useWallet();
  const { mySubscriptions, setMySubscriptions } = useConsumer((store) => ({
    mySubscriptions: store.mySubscriptions,
    setMySubscriptions: store.setMySubscriptions,
  }));

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
            //TODO: fix filter
            .filter((el) => el.account.user.toString() === publicKey.toString())
            .map(async (subscription) => {
              const id = v4({
                random: new BN(
                  subscription.account.serviceId.toString(),
                ).toArray("be"),
              });
              const service = await serviceAdapters.getContractServiceData(id);

              return {
                id: service.id.toString(),
                authority: service.authority.toString(),
                subscriptionPeriod: service.subscriptionPeriod.toString(),
                mint: service.mint.toString(),
                subPrice: service.subPrice.toString(),
                updatedAt: service.updatedAt.toNumber(),
                name: service.name.toString(),
                url: service.url.toString(),

                isActive: subscription.account.isActive,
                serviceId: subscription.account.serviceId.toString(),
                lastPayment: subscription.account.lastPayment.toNumber(),
                user: subscription.account.user.toString(),
              };
            }),
        );

        setMySubscriptions(parsedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    func();
  }, [publicKey, serviceAdapters, setMySubscriptions, subscriptionAdapters]);

  return (
    <div className="flex flex-col gap-4 h-full text-primary">
      <DataTable
        columns={columns}
        data={mySubscriptions}
        className="bg-card rounded-2xl"
        link={APP_ROUTES.DASHBOARD.PROVIDER(":providerId")}
      />
    </div>
  );
};
