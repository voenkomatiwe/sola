import { BN, web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export const DEFAULT_SUBSCRIPTION_PERIOD = new BN(2_629_743);
export const FULL_CAPACITY = new BN(10000);

export const TEST_ID = new PublicKey(
  "2wivZHNNjvwWgrQEkGvv1bH9HgaWxXmfogkB24z1tsJz"
);

export async function airdrop(
  connection: web3.Connection,
  publicKey: PublicKey
) {
  await connection.requestAirdrop(publicKey, 10 * web3.LAMPORTS_PER_SOL);

  // Wait for airdrop
  while ((await connection.getBalance(publicKey)) < web3.LAMPORTS_PER_SOL) {
    await sleep(100);
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function calculateFeeAmount(amount: BN, fee: BN): BN {
  return amount.mul(fee).div(FULL_CAPACITY);
}
