import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Role } from "@/interfaces";
import { APP_ROUTES } from "@/routes/constants";

export const Sidebar = () => {
  const { role } = useParams<{ role: Role }>();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", role === "provider");
  }, [role]);

  const toggle = () => {
    document.documentElement.classList.toggle("dark", role === "provider");
    navigate(
      APP_ROUTES.DASHBOARD.TO_HOME(
        role === "provider" ? "consumer" : "provider",
      ),
    );
  };

  return (
    <div className="w-1/4 bg-gray-800 text-white p-4 flex flex-col">
      <WalletMultiButton />
      <Link
        to={APP_ROUTES.DASHBOARD.TO_HOME(role || "consumer")}
        className="block p-2 hover:bg-gray-700"
      >
        HOME
      </Link>
      {role === "consumer" ? (
        <>
          <Link
            to={APP_ROUTES.DASHBOARD.WALLET.replace(":role", role)}
            className="block p-2 hover:bg-gray-700"
          >
            Wallet
          </Link>
          <Link
            to={APP_ROUTES.DASHBOARD.MY_SUBSCRIPTIONS}
            className="block p-2 hover:bg-gray-700"
          >
            My Subscriptions
          </Link>
          <Link
            to={APP_ROUTES.DASHBOARD.SUBSCRIPTIONS}
            className="block p-2 hover:bg-gray-700"
          >
            Explore Subscriptions
          </Link>
        </>
      ) : (
        <>
          <Link
            to={APP_ROUTES.DASHBOARD.WALLET}
            className="block p-2 hover:bg-gray-700"
          >
            Wallet
          </Link>
        </>
      )}

      <Button
        onClick={toggle}
        className="bg-blue-600 hover:bg-blue-700 mt-auto"
      >
        Switch to {role === "consumer" ? "Provider" : "Consumer"}
      </Button>
    </div>
  );
};
