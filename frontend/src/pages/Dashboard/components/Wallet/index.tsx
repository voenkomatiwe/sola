import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Wallet = () => {
  const { role } = useParams<{ role: string }>();
  const balance = 133;
  const lockedTokens = 100;

  return (
    <div>
      <Card className="flex flex-col gap-4 p-4 shadow border rounded-lg bg-card">
        <h2 className="text-lg font-semibold">Balance {role}</h2>
        <div className="">
          <p className="text-gray-700">
            <strong>Balance on Contract:</strong> {balance} SOL
          </p>
          <p className="text-gray-700">
            <strong>Locked Tokens:</strong> {lockedTokens} tokens
          </p>
        </div>
        <div className="flex justify-between flex-1 items-end">
          <Button>Deposit</Button>
          <Button variant="destructive">Withdraw</Button>
        </div>
      </Card>
    </div>
  );
};
