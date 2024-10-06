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
import { PublicKey, Signer, Transaction } from "@solana/web3.js";

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
    let account;
    try {
      account = await getAccount(
        this.program.provider.connection,
        associatedToken,
      );
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

        const transaction = new Transaction().add(
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

        await this.program.provider.sendAndConfirm(transaction);

        account = await getAccount(
          this.program.provider.connection,
          associatedToken,
        );
      } else {
        throw error;
      }
    }

    return account;
  }

  //   export async function replenishUserStorage(
  //   mint: PublicKey,
  //   amount: BN,
  //   wallet: Signer,
  // ) {
  //   const sender = wallet.publicKey;
  //   const [user, bump] = this.findUserAddress(sender);

  //   const userTokenAccount = await getOrCreateAssociatedTokenAccount(
  //     this.program.provider.connection,
  //     wallet,
  //     mint,
  //     user,
  //     true,
  //   );

  //   const senderTokenAccount = await getAssociatedTokenAddress(mint, sender);

  //   return await this.sendSigned(
  //     this.program.methods.replenishUserStorage(amount, bump).accounts({
  //       sender,
  //       user,
  //       senderTokenAccount,
  //       userTokenAccount: userTokenAccount.address,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //       systemProgram: web3.SystemProgram.programId,
  //     }),
  //     wallet,
  //   );
  // }

  public async replenishUserStorage(mint: PublicKey, amount: BN) {
    const sender = this.program.provider.publicKey;
    if (!sender) return;
    const [user, bump] = this.findUserAddress(sender);
    const userTokenAccount = await this.checkOrCreateATA(mint, user, true);
    console.log(userTokenAccount?.address);

    const senderTokenAccount = await getAssociatedTokenAddress(mint, sender);

    const transactionInstruction = await this.program.methods
      .replenishUserStorage(amount, bump)
      .accounts({
        sender,
        user,
        senderTokenAccount,
        userTokenAccount: userTokenAccount?.address,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .instruction();

    const transaction = new Transaction().add(transactionInstruction);
    transaction.feePayer = sender;
    const simulate = await this.connection.simulateTransaction(transaction);
    console.log("replenishUserStorage", simulate);

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
