import { DataTable } from "@/components/DataTable";
import { columns } from "@/constants/columns/explore";
import { useConsumer } from "@/hooks/store/useConsumer";
import { APP_ROUTES } from "@/routes/constants";

export const ExploreProviders = () => {
  const providers = useConsumer((store) => store.providers);
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
