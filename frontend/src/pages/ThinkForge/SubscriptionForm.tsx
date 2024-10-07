import { BN, Wallet } from "@coral-xyz/anchor";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";

import sola from "@/assets/icons/sola.svg";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { contractAddress } from "@/config";
import { SubscriptionAdapter } from "@/lib/contract";
import { APP_ROUTES } from "@/routes/constants";

export const SubscriptionForm = () => {
  const { connection } = useConnection();
  const { connected, publicKey } = useWallet();
  const wallet = useAnchorWallet();

  const navigate = useNavigate();
  const [period, setPeriod] = useState<string>("1");
  const pricePerMonth = "3.99";
  const [transactionSignature, setTransactionSignature] = useState<
    string | null
  >(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected) {
      console.log("Please connect your wallet");
      return;
    }

    const subscriptionAdapter = new SubscriptionAdapter(
      connection,
      wallet as Wallet,
      contractAddress,
    );

    //TODO: ?????????????
    const trx = await subscriptionAdapter.activateSubscription(
      v4({
        random: new BN("153807357704477413592972126688430806559").toArray("be"),
      }),
    );

    setTransactionSignature(trx || null);
  };
  if (transactionSignature) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4 w-full text-white">
        <div className="flex flex-col dashboard p-4 rounded-2xl items-center justify-between">
          <div className="flex items-start justify-start w-full text-5xl gap-2 rubik-one">
            <img src={sola} alt="sola" className="w-10 h-10" />
            Sola
          </div>

          <div className="flex flex-col items-center p-4 px-4 justify-between text-lg text-white">
            <p className="font-bold text-2xl">Transaction Successful!</p>
            <Button
              variant="link"
              className="text-white"
              onClick={() =>
                window.open(
                  `https://explorer.solana.com/tx/${transactionSignature}?cluster=${WalletAdapterNetwork.Devnet}`,
                  "_blank",
                  "noopener noreferrer",
                )
              }
            >
              View Transaction on Solana Explorer
            </Button>
            <p className="text-base mb-2">or</p>
            <Button
              onClick={() =>
                navigate(APP_ROUTES.DASHBOARD.TO_HOME(":consumer"))
              }
            >
              Dashboard
            </Button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full text-white">
      <div className="flex flex-col dashboard p-4 rounded-2xl items-center justify-between">
        <div className="flex items-start justify-start w-full text-5xl gap-2 rubik-one">
          <img src={sola} alt="sola" className="w-10 h-10" />
          Sola
        </div>
        {connected && publicKey && !transactionSignature && (
          <div className="p-6 w-full">
            <div className="mb-4 flex justify-between w-full">
              <p className="text-sm font-medium">Connected Account</p>
              <p>
                {publicKey.toBase58().slice(0, 5)}...
                {publicKey.toBase58().slice(-5)}
              </p>
            </div>
            <div className="mb-4 flex flex-row gap-3 items-end w-full justify-between">
              <p className="block text-sm font-medium text-center">Period</p>
              <ToggleGroup
                variant="outline"
                type="single"
                value={period}
                onValueChange={(e) => setPeriod(e)}
              >
                <ToggleGroupItem value="1">1 month</ToggleGroupItem>
                <ToggleGroupItem value="3">3 months</ToggleGroupItem>
                <ToggleGroupItem value="6">6 months</ToggleGroupItem>
                <ToggleGroupItem value="12">12 months</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        )}
        <div>
          {connected ? (
            <Button type="submit">
              Subscribe for {Number(pricePerMonth) * Number(period)} SOL
            </Button>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-lg mb-4">
                Please connect your Solana wallet to continue
              </p>
              <WalletMultiButton className="btn-wallet-connect" />
            </div>
          )}
        </div>
      </div>
    </form>
  );
};
