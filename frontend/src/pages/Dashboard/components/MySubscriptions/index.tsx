import { useParams } from "react-router-dom";

export const MySubscriptions = () => {
  const { role } = useParams<{ role: string }>();
  return <h1 className="text-2xl">MySubscriptions: ({role})</h1>;
};
