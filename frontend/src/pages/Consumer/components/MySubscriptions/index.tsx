import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";

import { DataTable } from "@/components/DataTable";
import { columns } from "@/constants/columns/mySubscriptions";
import { useAdapters } from "@/hooks/store/useAdapters";
import { useConsumer } from "@/hooks/store/useConsumer";
import { APP_ROUTES } from "@/routes/constants";

export const MySubscriptions = () => {
  const { publicKey } = useWallet();
  const { mySubscriptions } = useConsumer((store) => ({
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
        if (!subscriptionAdapters || !serviceAdapters || !publicKey) return;
        const result = await subscriptionAdapters.getAllSubscriptions();

        const parsedServices = await Promise.all(
          result
            //TODO: fix filter
            .map(async (subscription) => {
              //TODO
              // const service = await serviceAdapters.getContractServiceData(
              //   subscription.account.serviceId.toString(),
              // );
              // console.log(service);

              return {
                bump: subscription.account.bump,
                isActive: subscription.account.isActive,
                serviceId: subscription.account.serviceId.toString(),
                lastPayment: subscription.account.lastPayment.toNumber(),
                user: subscription.account.user.toString(),
              };
            }),
        );
        console.log("result", parsedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    func();
  }, [publicKey, serviceAdapters, subscriptionAdapters]);

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
