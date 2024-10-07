type Environment = "mainnet" | "devnet";

interface IConfig {
  contractAddress: string;
  tokenAddress: string;
  tokenAccount: string;
  customServiceId: string;
}

const mainnet: IConfig = {
  contractAddress: "",
  tokenAddress: "",
  tokenAccount: "",
  customServiceId: "",
};

const devnet: IConfig = {
  contractAddress: "AbTt5oYWeBDh6qkYN4YPgEkL3gom81CXMW73tDctr85K",
  tokenAddress: "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
  tokenAccount: "4r1YezyMmxBTG9gukMPzubVUZUAV4JYTutNVzChHSQZv",
  customServiceId: "34894228-d670-420a-916e-4fafc6ca6131",
};

const environments: Record<Environment, IConfig> = {
  mainnet,
  devnet,
};

export const currentEnvironment: Environment =
  (import.meta.env.VITE_ENV_APP as Environment) || "devnet";

export const {
  contractAddress,
  tokenAccount,
  tokenAddress,
  customServiceId,
}: IConfig = {
  ...environments[currentEnvironment],
};
