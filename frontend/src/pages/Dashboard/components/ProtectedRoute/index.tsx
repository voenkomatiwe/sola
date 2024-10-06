// import { useWallet } from "@solana/wallet-adapter-react";
import { PropsWithChildren } from "react";
// import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  // const { connected } = useWallet();

  // if (!connected) {
  //   return <Navigate to="/" replace />;
  // }

  return children;
};

export default ProtectedRoute;
