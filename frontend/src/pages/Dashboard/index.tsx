import { Outlet, useParams } from "react-router-dom";

import { Role } from "@/interfaces";
import { Consumer } from "@/pages/Dashboard/components/Consumer";
import { Provider } from "@/pages/Dashboard/components/Provider";

import { Sidebar } from "./components/Sidebar";

export const DashboardByRole = () => {
  const { role } = useParams<{ role: Role }>();
  return role === "provider" ? <Provider /> : <Consumer />;
};

export const Dashboard = () => {
  return (
    <div className="flex h-screen dashboard p-6">
      <Sidebar />
      <div className="flex flex-col gap-4 flex-grow h-ful text-foreground">
        <div className="bg-map overflow-y-auto bg-clip-border rounded-3xl h-full p-6 relative">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
