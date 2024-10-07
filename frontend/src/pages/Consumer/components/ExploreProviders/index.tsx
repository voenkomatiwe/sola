import { useEffect } from "react";

import { DataTable } from "@/components/DataTable";
import { columns } from "@/constants/columns/explore";
import { useAdapters } from "@/hooks/store/useAdapters";
import { useConsumer } from "@/hooks/store/useConsumer";
import { bufferToString } from "@/lib/contract/utils";
import { APP_ROUTES } from "@/routes/constants";

export const ExploreProviders = () => {
  const { providers, setProviders } = useConsumer((store) => ({
    providers: store.providers,
    setProviders: store.setProviders,
  }));
  const service = useAdapters((store) => store.service);

  useEffect(() => {
    const func = async () => {
      try {
        if (!service || providers.length) return;
        const result = await service.getAllServices();

        const parsedServices = result.map((service) => ({
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

        setProviders(parsedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    func();
  }, [service]);

  return (
    <div className="flex flex-col gap-4 h-full text-primary">
      <DataTable
        columns={columns}
        data={providers}
        className="bg-card rounded-2xl"
        link={APP_ROUTES.DASHBOARD.PROVIDER_SUBSCRIPTIONS(":providerId")}
      />
    </div>
  );
};
