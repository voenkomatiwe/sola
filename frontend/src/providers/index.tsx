import { Outlet } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";

import { SolanaProvider } from "./solana-provider";

export const Providers = () => {
  return (
    <SolanaProvider>
      <Toaster />
      <Outlet />
    </SolanaProvider>
  );
};
