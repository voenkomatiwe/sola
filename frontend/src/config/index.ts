type Environment = "mainnet" | "devnet";

interface IConfig {
  contractAddress: string;
  tokenAddress: string;
  tokenAccount: string;
}

const mainnet: IConfig = {
  contractAddress: "",
  tokenAddress: "",
  tokenAccount: "",
};

const devnet: IConfig = {
  contractAddress: "AbTt5oYWeBDh6qkYN4YPgEkL3gom81CXMW73tDctr85K",
  tokenAddress: "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
  tokenAccount: "4r1YezyMmxBTG9gukMPzubVUZUAV4JYTutNVzChHSQZv",
};

const environments: Record<Environment, IConfig> = {
  mainnet,
  devnet,
};

export const currentEnvironment: Environment =
  (import.meta.env.VITE_ENV_APP as Environment) || "devnet";

export const { contractAddress, tokenAccount, tokenAddress }: IConfig = {
  ...environments[currentEnvironment],
};
