import { BN, Wallet, web3 } from "@coral-xyz/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
  ComputeBudgetProgram,
  PublicKey,
  Signer,
  Transaction,
} from "@solana/web3.js";

import { ContractBase } from "./baseAdapter";
import { bufferFromString } from "./utils";

export class UserAdapter extends ContractBase {
  constructor(
    connection: web3.Connection,
    wallet: Wallet,
    contractAddress: string,
  ) {
    super(connection, wallet, contractAddress);
  }

  public findUserAddress(address: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [bufferFromString("user"), address.toBytes()],
      this.program.programId,
    );
  }

  public async getUserData(address: PublicKey) {
    const [userAddress] = this.findUserAddress(address);
    return await this.program.account.user.fetch(userAddress);
  }

  public async getAllUsers() {
    return await this.program.account.user.all();
  }

  public async checkOrCreateATA(
    mint: PublicKey,
    owner: PublicKey,
    allowOwnerOffCurve = false,
  ) {
    const associatedToken = getAssociatedTokenAddressSync(
      mint,
      owner,
      allowOwnerOffCurve,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    const computeBudgetTx = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 100000000,
    });

    try {
      await getAccount(this.program.provider.connection, associatedToken);
    } catch (error: unknown) {
      if (
        error instanceof TokenAccountNotFoundError ||
        error instanceof TokenInvalidAccountOwnerError
      ) {
        if (
          !this.program.provider.sendAndConfirm ||
          !this.program.provider.publicKey
        )
          return;

        const transaction = new Transaction()
          .add(computeBudgetTx)
          .add(
            createAssociatedTokenAccountInstruction(
              this.program.provider.publicKey,
              associatedToken,
              owner,
              mint,
              TOKEN_PROGRAM_ID,
              ASSOCIATED_TOKEN_PROGRAM_ID,
            ),
          );

        transaction.feePayer = this.program.provider.publicKey;

        const txSignature =
          await this.program.provider.sendAndConfirm(transaction);
        return txSignature;
      } else {
        throw error;
      }
    }

    return associatedToken;
  }

  public async replenishUserStorage(mint: PublicKey, amount: BN) {
    const sender = this.program.provider.publicKey;
    if (!sender) return;
    const [user, bump] = this.findUserAddress(sender);

    const userTokenAccount = await this.checkOrCreateATA(mint, user, true);
    const senderTokenAccount = await getAssociatedTokenAddress(mint, sender);

    const transactionInstruction = await this.program.methods
      .replenishUserStorage(amount, bump)
      .accounts({
        sender,
        user,
        senderTokenAccount,
        userTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .instruction();

    const transaction = new Transaction().add(transactionInstruction);
    transaction.feePayer = sender;

    if (!this.program.provider.sendAndConfirm) return;

    return await this.program.provider.sendAndConfirm(transaction);
  }
  /* eslint-disable @typescript-eslint/no-unused-vars */

  public async withdrawFromUserStorage(
    mint: PublicKey,
    amount: BN,
    wallet?: Signer,
  ) {}
}
