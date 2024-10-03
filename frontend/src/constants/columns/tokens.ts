import { toMap } from "@/utils";

const tokensArray = [
  {
    chainId: 101,
    address: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    name: "Wrapped SOL",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    extensions: {
      coingeckoId: "solana",
      serumV3Usdc: "9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT",
      serumV3Usdt: "HWHvQhFmJB3NUcu1aihKmrKegfVxBEHzwVX6yZCKEsi1",
      website: "https://solana.com/",
    },
  },
  {
    chainId: 101,
    address: "6VNKqgz9hk7zRShTFdg5AnkfKwZUcojzwAkzxSH3bnUm",
    symbol: "wHAPI",
    name: "Wrapped HAPI",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/6VNKqgz9hk7zRShTFdg5AnkfKwZUcojzwAkzxSH3bnUm/logo.png",
    tags: ["wrapped", "utility-token"],
    extensions: {
      coingeckoId: "hapi",
      github: "https://github.com/HAPIprotocol/HAPI/",
      medium: "https://medium.com/i-am-hapi",
      telegram: "https://t.me/hapiHF",
      twitter: "https://twitter.com/i_am_hapi_one",
      website: "https://hapi.one",
    },
  },
  {
    chainId: 101,
    address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    symbol: "USDT",
    name: "USDT",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg",
    tags: ["stablecoin"],
    extensions: {
      coingeckoId: "tether",
      serumV3Usdc: "77quYg4MGneUdjgXCunt9GgM1usmrxKY31twEy3WHwcS",
      website: "https://tether.to/",
    },
  },
  {
    chainId: 101,
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    tags: ["stablecoin"],
    extensions: {
      coingeckoId: "usd-coin",
      serumV3Usdt: "77quYg4MGneUdjgXCunt9GgM1usmrxKY31twEy3WHwcS",
      website: "https://www.centre.io/",
    },
  },
];

export const TOKEN_ADDRESSES = {
  SOL: "So11111111111111111111111111111111111111112",
  HAPI: "6VNKqgz9hk7zRShTFdg5AnkfKwZUcojzwAkzxSH3bnUm",
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
};

export const tokens = toMap(tokensArray, "address");
