import { Outlet, useParams } from "react-router-dom";

import { Consumer } from "@/pages/Dashboard/components/Consumer";
import { Provider } from "@/pages/Dashboard/components/Provider";

import { Sidebar } from "./components/Sidebar";

export const DashboardByRole = () => {
  const { role } = useParams<{ role: string }>();
  return role === "provider" ? <Provider /> : <Consumer />;
};

export const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-800">
      <Sidebar />
      <div className="flex-grow py-6 pr-6 h-ful">
        <div className="bg-white rounded-3xl h-full p-3 pl-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
