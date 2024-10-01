import { useParams } from "react-router-dom";

export const Explore = () => {
  const { role } = useParams<{ role: string }>();
  return <h1 className="text-2xl">Explore: ({role})</h1>;
};
