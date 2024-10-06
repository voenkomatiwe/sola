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
import { PublicKey, Transaction } from "@solana/web3.js";
import { parse as uuidParse } from "uuid";

import { contractAddress } from "@/config";

import { ContractBase } from "./baseAdapter";
import { ServiceAdapter } from "./serviceAdapter";
import { UserAdapter } from "./userAdapter";
import { bufferFromString } from "./utils";

export class SubscriptionAdapter extends ContractBase {
  constructor(
    connection: web3.Connection,
    wallet: Wallet,
    contractAddress: string,
  ) {
    super(connection, wallet, contractAddress);
  }

  public findSubscriptionAddress(
    userAddress: PublicKey,
    serviceId: string,
  ): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [
        bufferFromString("subscription"),
        userAddress.toBytes(),
        uuidParse(serviceId),
      ],
      this.program.programId,
    );
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

  public async getSubscriptionData(userAddress: PublicKey, serviceId: string) {
    const [subscription] = this.findSubscriptionAddress(userAddress, serviceId);
    return await this.program.account.subscription.fetch(subscription);
  }

  public async getAllSubscriptions() {
    return await this.program.account.subscription.all();
  }

  public async activateSubscription(serviceId: string) {
    const sender = this.program.provider.publicKey;
    if (!sender) return;

    const [subscription, bump] = this.findSubscriptionAddress(
      sender,
      serviceId,
    );
    const serviceAdapter = new ServiceAdapter(
      this.program.provider.connection,
      this.wallet,
      contractAddress,
    );
    const userAdapter = new UserAdapter(
      this.program.provider.connection,
      this.wallet,
      contractAddress,
    );
    const data = await serviceAdapter.getContractServiceData(serviceId);

    const amount = new BN(100);

    await userAdapter.replenishUserStorage(data.mint, amount);
    const [user] = this.findUserAddress(sender);
    const [service] = this.findContractServiceAddress(serviceId);

    const userTokenAccount = await getAssociatedTokenAddress(
      data.mint,
      user,
      true,
    );
    const serviceTokenAccount = await this.checkOrCreateATA(
      data.mint,
      service,
      true,
    );

    const instructions = await this.program.methods
      .activateSubscription(bump)
      .accounts({
        sender,
        subscription,
        user,
        service,
        serviceTokenAccount: serviceTokenAccount?.address,
        userTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .instruction();
    const subscribeTransaction = new Transaction().add(instructions);
    subscribeTransaction.feePayer = sender;
    const simulate =
      await this.connection.simulateTransaction(subscribeTransaction);

    console.log(simulate);
    if (!this.program.provider.sendAndConfirm) return;
    return await this.program.provider.sendAndConfirm(subscribeTransaction);
  }

  // public async deactivateSubscription(serviceId: string, wallet?: Signer) {}

  // public async chargeSubscriptionPayment(
  //   serviceId: string,
  //   userWallet: PublicKey,
  //   wallet?: Signer,
  // ) {}
}
