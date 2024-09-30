import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState } from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Service } from "@/pages/Dashboard/components/Service";
import { User } from "@/pages/Dashboard/components/User";

export const Dashboard = () => {
  const [type, setType] = useState<"user" | "service">("user");

  return (
    <div className="w-full flex flex-col gap-4">
      <header className="flex justify-between px-6 py-3 w-full items-center">
        <ToggleGroup
          variant="outline"
          type="single"
          defaultValue={type}
          value={type}
          onValueChange={(value: "user" | "service") => setType(value)}
        >
          <ToggleGroupItem value="user">User</ToggleGroupItem>
          <ToggleGroupItem value="service">Service</ToggleGroupItem>
        </ToggleGroup>
        <div className="flex gap-2">
          <WalletMultiButton />
        </div>
      </header>
      {type === "user" ? <User /> : <Service />}
    </div>
  );
};
