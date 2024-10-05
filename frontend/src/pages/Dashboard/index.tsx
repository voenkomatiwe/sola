import { Wallet } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";

import { contractAddress } from "@/config";
import { useAdaptors } from "@/hooks/store/useAdaptors";
import { Role } from "@/interfaces";
import {
  ServiceAdapter,
  SubscriptionAdapter,
  UserAdapter,
} from "@/lib/contract";
import { Consumer } from "@/pages/Dashboard/components/Consumer";
import { Provider } from "@/pages/Dashboard/components/Provider";

import { Sidebar } from "./components/Sidebar";

export const DashboardByRole = () => {
  const { role } = useParams<{ role: Role }>();
  return role === "provider" ? <Provider /> : <Consumer />;
};

export const Dashboard = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const setAdaptors = useAdaptors((store) => store.setAdaptors);

  useEffect(() => {
    if (!wallet) return;
    const serviceAdapter = new ServiceAdapter(
      connection,
      wallet as Wallet,
      contractAddress,
    );
    const userAdapter = new UserAdapter(
      connection,
      wallet as Wallet,
      contractAddress,
    );
    const subscriptionAdapter = new SubscriptionAdapter(
      connection,
      wallet as Wallet,
      contractAddress,
    );
    setAdaptors({
      service: serviceAdapter,
      user: userAdapter,
      subscription: subscriptionAdapter,
    });
  }, [wallet, connection, setAdaptors]);

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
