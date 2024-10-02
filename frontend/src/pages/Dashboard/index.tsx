import { Youtube } from "lucide-react";
import { Outlet, useParams } from "react-router-dom";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Role } from "@/interfaces";
import { Consumer } from "@/pages/Dashboard/components/Consumer";
import { Provider } from "@/pages/Dashboard/components/Provider";

import { Sidebar } from "./components/Sidebar";

export const DashboardByRole = () => {
  const { role } = useParams<{ role: Role }>();
  return role === "provider" ? <Provider /> : <Consumer />;
};
export const Dashboard = () => {
  const { role } = useParams<{ role: Role }>();
  return (
    <div className="flex h-screen dashboard p-6">
      <Sidebar />
      <div className="flex flex-col gap-4 flex-grow h-ful text-foreground">
        {role === "consumer" && (
          <Alert className="bg-black text-white border-none px-8">
            <Youtube color="white" className="h-7 w-7" />
            <AlertTitle>Hi, You have message</AlertTitle>
            <AlertDescription>
              Youtube has changed the payment method, click on the notification
              to see the details.
            </AlertDescription>
          </Alert>
        )}
        <div className="bg-map overflow-y-auto bg-clip-border rounded-3xl h-full p-6 relative">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
