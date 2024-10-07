import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";

import { useAdapters } from "@/hooks/store/useAdapters";
import { useProvider } from "@/hooks/store/useProvider";

import SubscriptionFormModal from "./components/CreateServiceFrom";

export const Provider = () => {
  const { publicKey } = useWallet();
  const { setMyServices } = useProvider((store) => ({
    myServices: store.myServices,
    setMyServices: store.setMyServices,
  }));
  const { service } = useAdapters();

  useEffect(() => {
    const func = async () => {
      if (!service || !publicKey) return;
      setMyServices([]);
    };
    func();
  }, [publicKey, service, setMyServices]);

  return (
    <div>
      <SubscriptionFormModal />
    </div>
  );
};
