import { useParams } from "react-router-dom";

export const Wallet = () => {
  const { role } = useParams<{ role: string }>();
  return <h1 className="text-2xl">Wallet: ({role})</h1>;
};
