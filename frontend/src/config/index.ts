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
  customServiceId: "c722d2b3-6545-4cfa-af1e-15ba7816838f",
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
