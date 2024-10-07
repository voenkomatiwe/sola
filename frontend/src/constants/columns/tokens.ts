import { toMap } from "@/utils";

export const TOKEN_ADDRESSES = {
  SOL: "11111111111111111111111111111111",
  USDC: "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
};

const tokensArray = [
  {
    chainId: 101,
    address: TOKEN_ADDRESSES.SOL,
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
    address: TOKEN_ADDRESSES.USDC,
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

export const tokens = toMap(tokensArray, "address");
