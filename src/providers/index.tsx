import { Outlet } from "react-router-dom";

import { SolanaProvider } from "./solana-provider";

export const Providers = () => {
  return (
    <SolanaProvider>
      <Outlet />
    </SolanaProvider>
  );
};
