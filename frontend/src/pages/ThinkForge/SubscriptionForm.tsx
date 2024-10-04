import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { useState } from "react";

import sola from "@/assets/icons/sola.svg";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const SubscriptionForm = () => {
  const { connected, publicKey } = useWallet();

  const [period, setPeriod] = useState<string>("1");
  const pricePerMonth = "3.99";
  const [transactionSignature, setTransactionSignature] = useState<
    string | null
  >(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected) {
      console.log("Please connect your wallet");
      return;
    }

    setTransactionSignature("sola");
  };

  if (transactionSignature) {
    return (
      <div className="flex flex-col gap4">
        <div className="flex items-center px-4 justify-between text-lg text-white">
          <p className="font-semibold mb-2">Transaction Successful!</p>
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
        </div>
        <div className="flex dashboard p-4 rounded-2xl items-center justify-between">
          <div className="flex items-center text-5xl gap-2">
            <img src={sola} alt="sola" className="w-10 h-10" />
            Sola
          </div>
          <Button>Dashboard</Button>
        </div>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full text-white">
      <div className="flex items-center text-5xl gap-2 justify-center">
        <img src={sola} alt="sola" className="w-10 h-10" />
        Sola
      </div>
      {connected && publicKey && (
        <div className="mb-4 flex justify-between">
          <p className="text-sm font-medium">Connected Account</p>
          <p>{publicKey.toBase58()}</p>
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3">
        <p className="block text-sm font-medium text-center">Period</p>
        <ToggleGroup
          variant="outline"
          type="single"
          value={period}
          onValueChange={(e) => setPeriod(e)}
        >
          <ToggleGroupItem value="1">1</ToggleGroupItem>
          <ToggleGroupItem value="3">3</ToggleGroupItem>
          <ToggleGroupItem value="6">6</ToggleGroupItem>
          <ToggleGroupItem value="12">12</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="mb-4 flex justify-between">
        <p className="text-sm font-medium">Price</p>
        <p className="font-semibold">
          {Number(pricePerMonth) * Number(period)} SOL
        </p>
      </div>

      {connected ? (
        <Button
          type="submit"
          variant="outline"
          className="w-full text-foreground"
        >
          Subscribe
        </Button>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-lg mb-4">
            Please connect your Solana wallet to continue
          </p>
          <WalletMultiButton className="btn-wallet-connect" />
        </div>
      )}
    </form>
  );
};
