import { DataTable } from "@/components/DataTable";
import { columns } from "@/constants/columns/mySubscriptions";
import { useConsumer } from "@/hooks/store/useConsumer";
import { APP_ROUTES } from "@/routes/constants";

export const MySubscriptions = () => {
  const mySubscriptions = useConsumer((store) => store.mySubscriptions);
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
