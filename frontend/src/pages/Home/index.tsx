import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import sola from "@/assets/icons/sola.svg";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/routes/constants";

export function Home() {
  const navigate = useNavigate();
  const { connected, disconnect, publicKey } = useWallet();

  const formattedPublicKey = useMemo(() => {
    return publicKey
      ? publicKey.toBase58().slice(0, 4) +
          "..." +
          publicKey.toBase58().slice(-4)
      : null;
  }, [publicKey]);

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen bg-gray-100">
      <div className="flex items-center gap-3">
        <h1 className="text-4xl font-bold">Welcome to Sola</h1>
        <img src={sola} alt="sola" className="w-8 h-8" />
      </div>

      {connected ? (
        <div className="flex flex-col items-center">
          <p className="text-lg mb-4">
            Connected Account: {formattedPublicKey}
          </p>

          <Button
            onClick={() => navigate(APP_ROUTES.DASHBOARD.TO_HOME("consumer"))}
          >
            Open Dashboard
          </Button>

          <Button className="mt-4" variant="outline" onClick={disconnect}>
            Disconnect Wallet
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-lg mb-4">
            Please connect your Solana wallet to continue
          </p>
          <WalletMultiButton className="btn-wallet-connect" />
        </div>
      )}
    </div>
  );
}
