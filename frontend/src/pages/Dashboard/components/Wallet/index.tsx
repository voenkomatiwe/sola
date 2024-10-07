import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { tokens } from "@/constants/columns/tokens";
import { Role } from "@/interfaces";

const ProviderWallet = () => {
  return <>ProviderWallet</>;
};

const ConsumerWallet = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center">
        <h2 className="mb-4 text-left text-3xl w-full">List tokens</h2>
        <div className="flex flex-col gap-4 w-full">
          {Object.values(tokens).map((token) => (
            <Card
              key={token.address}
              className="p-4 flex gap-3 justify-between items-center bg-white shadow-lg"
            >
              <img
                src={token.logoURI}
                alt={token.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col flex-1">
                <span className="font-medium">{token.name}</span>
                <span className="text-sm text-gray-500">Locked: 15</span>
              </div>
              <div className="flex space-x-2">
                <Button>Deposit</Button>
                <Button variant="destructive">Withdraw</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>{" "}
    </div>
  );
};

export const Wallet = () => {
  const { role } = useParams<{ role: Role }>();
  return role === "consumer" ? <ConsumerWallet /> : <ProviderWallet />;
};
