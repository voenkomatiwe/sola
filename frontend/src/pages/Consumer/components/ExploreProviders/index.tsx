import { useEffect } from "react";

import { DataTable } from "@/components/DataTable";
import { columns } from "@/constants/columns/explore";
import { useAdapters } from "@/hooks/store/useAdapters";
import { useConsumer } from "@/hooks/store/useConsumer";
import { APP_ROUTES } from "@/routes/constants";

export const ExploreProviders = () => {
  const providers = useConsumer((store) => store.providers);
  const service = useAdapters((store) => store.service);

  useEffect(() => {
    const func = async () => {
      try {
        if (!service) return;
        const result = await service.getAllServices();

        const parsedServices = result.map((service) => ({
          id: service.account.id.toString(),
          authority: service.account.authority.toString(),
          subscriptionPeriod: service.account.subscriptionPeriod.toString(),
          mint: service.account.mint.toString(),
          subPrice: service.account.subPrice.toNumber(),
          updatedAt: service.account.updatedAt.toNumber(),
          version: service.account.version.toString(),
          name: service.account.name.toString(),
          url: service.account.url.toString(),
        }));
        console.log("result", parsedServices);
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
