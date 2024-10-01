import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect } from "react";
import {
  NavLinkProps,
  NavLink as RouterNavLink,
  useNavigate,
  useParams,
} from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Role } from "@/interfaces";
import { APP_ROUTES } from "@/routes/constants";

const NavLink = (props: NavLinkProps & { title: string }) => {
  return (
    <RouterNavLink
      {...props}
      className={({ isActive }) => `text-sidebar-foreground hover:text-card
        px-3 py-2
        transition-colors duration-200
        font-semibold
        text-xl
        ${isActive && "!text-card"}`}
    >
      {props.title}
    </RouterNavLink>
  );
};

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
    <div className="w-80 p-4 py-6 flex flex-col justify-between">
      <WalletMultiButton />
      <div className="flex flex-col gap-4">
        <NavLink
          to={APP_ROUTES.DASHBOARD.TO_HOME(role || "consumer")}
          title="Dashboard"
        />
        <NavLink to={APP_ROUTES.DASHBOARD.WALLET} title="Wallet" />
        {role === "consumer" && (
          <>
            <NavLink
              to={APP_ROUTES.DASHBOARD.MY_SUBSCRIPTIONS}
              title="My Subscriptions"
            />
            <NavLink to={APP_ROUTES.DASHBOARD.EXPLORE} title="Explore" />
          </>
        )}
      </div>
      <Button onClick={toggle} variant="ghost">
        Switch to {role === "consumer" ? "Provider" : "Consumer"}
      </Button>
    </div>
  );
};
