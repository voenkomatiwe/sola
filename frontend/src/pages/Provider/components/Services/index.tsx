import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";

import { DataTable } from "@/components/DataTable";
import { columns } from "@/constants/columns/explore";
import { useAdapters } from "@/hooks/store/useAdapters";
import { useProvider } from "@/hooks/store/useProvider";
import { bufferToString } from "@/lib/contract/utils";

export const Services = () => {
  const { publicKey } = useWallet();

  const { myServices, setMyServices } = useProvider((store) => ({
    myServices: store.myServices,
    setMyServices: store.setMyServices,
  }));
  const service = useAdapters((store) => store.service);

  useEffect(() => {
    const func = async () => {
      try {
        if (!service || myServices.length) return;
        const result = await service.getAllServices();

        const parsedServices = result
          .filter(
            (el) => el.account.authority.toString() === publicKey?.toString(),
          )
          .map((service) => ({
            id: service.account.id.toString(),
            authority: service.account.authority.toString(),
            subscriptionPeriod: service.account.subscriptionPeriod.toString(),
            mint: service.account.mint.toString(),
            subPrice: service.account.subPrice.toString(),
            updatedAt: service.account.updatedAt.toNumber(),
            version: service.account.version.toString(),
            name: bufferToString(service.account.name),
            url: bufferToString(service.account.url),
          }));

        setMyServices(parsedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    func();
  }, [publicKey, service, setMyServices]);

  return (
    <div className="flex flex-col gap-4 h-full text-primary">
      <DataTable
        columns={columns}
        data={myServices}
        className="bg-card rounded-2xl"
      />
    </div>
  );
};
