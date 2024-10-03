import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useMemo } from "react";
import {
  NavLinkProps,
  NavLink as RouterNavLink,
  useNavigate,
  useParams,
} from "react-router-dom";

import sola from "@/assets/icons/sola.svg";
import { Button } from "@/components/ui/button";
import { Role } from "@/interfaces";
import { APP_ROUTES } from "@/routes/constants";

const NavLink = (props: NavLinkProps & { title: string }) => {
  return (
    <RouterNavLink
      {...props}
      end
      className="relative text-2xl font-Helvetica text-main-foreground hover:text-card px-3 py-2 transition-colors duration-200 font-semibold"
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute -left-2 top-1/2 transform -translate-y-1/2">
              |
            </span>
          )}
          {props.title}
        </>
      )}
    </RouterNavLink>
  );
};

export const Sidebar = () => {
  const { role } = useParams<{ role: Role }>();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", role !== "provider");
  }, [role]);

  const toggle = () => {
    document.documentElement.classList.toggle("dark", role !== "provider");
    navigate(
      APP_ROUTES.DASHBOARD.TO_HOME(
        role === "provider" ? "consumer" : "provider",
      ),
    );
  };

  const { disconnect, publicKey } = useWallet();
  const formattedPublicKey = useMemo(() => {
    return publicKey
      ? publicKey.toBase58().slice(0, 4) +
          "..." +
          publicKey.toBase58().slice(-4)
      : null;
  }, [publicKey]);

  return (
    <div className="max-w-80 min-w-80 gap-14 flex flex-col justify-between">
      <div className="flex items-center gap-4">
        <img src={sola} alt="sola" className="w-14 h-14" />
        <h2 className="font-bold text-7xl font-Helvetica tracking-tighter">
          Sola
        </h2>
      </div>

      <div className="flex flex-col gap-4 flex-1">
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
            <NavLink
              to={APP_ROUTES.DASHBOARD.EXPLORE_PROVIDERS}
              title="Explore Providers"
            />
          </>
        )}
      </div>
      <div className="flex flex-col gap-3 pr-6">
        <Button onClick={toggle} variant="ghost">
          Switch to {role === "consumer" ? "Provider" : "Consumer"}
        </Button>
        <Button variant="destructive" onClick={disconnect}>
          Disconnect {formattedPublicKey}
        </Button>
      </div>
    </div>
  );
};
