import { BN, web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import * as crypto from "crypto";

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
