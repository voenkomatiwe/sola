import { utils } from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import BN from "bn.js";
import { useEffect } from "react";
import { v4 } from "uuid";

import { DataTable } from "@/components/DataTable";
import { columns } from "@/constants/columns/mySubscriptions";
import { useAdapters } from "@/hooks/store/useAdapters";
import { useConsumer } from "@/hooks/store/useConsumer";
import { bufferFromString } from "@/lib/contract/utils";
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
        console.log(publicKey.toString(), result);
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
