import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import {
  PublicKey,
  Signer,
  ComputeBudgetProgram,
  Transaction,
} from "@solana/web3.js";
import {
  getAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
} from "@solana/spl-token";

import { MethodsBuilder } from "@coral-xyz/anchor/dist/cjs/program/namespace/methods";
import { IDL, SubService } from "../idl/sub_service";

import * as service from "./service";
import * as user from "./user";
import * as subscription from "./subscription";

export class SubServiceProgram {
  program: Program<SubService>;
  programId: PublicKey;
  computeUnitPrice: number;

  constructor(
    SubServiceProgramId: string | PublicKey,
    provider?: AnchorProvider,
    computeUnitPrice?: number
  ) {
    this.programId =
      typeof SubServiceProgramId === "string"
        ? new PublicKey(SubServiceProgramId)
        : SubServiceProgramId;

    this.program = new Program(IDL, this.programId, provider);
    // Default compute unit price is 10,000 microlamports
    this.computeUnitPrice = computeUnitPrice || 10000;

    this.findContractServiceAddress =
      service.findContractServiceAddress.bind(this);
    this.getContractServiceData = service.getContractServiceData.bind(this);
    this.getAllServices = service.getAllServices.bind(this);
    this.createService = service.createService.bind(this);
    this.removeService = service.removeService.bind(this);
    this.updateServiceAuthority = service.updateServiceAuthority.bind(this);
    this.updateServiceMint = service.updateServiceMint.bind(this);
    this.updateServicePrice = service.updateServicePrice.bind(this);
    this.withdrawFromServiceStorage =
      service.withdrawFromServiceStorage.bind(this);

    this.findUserAddress = user.findUserAddress.bind(this);
    this.getUserData = user.getUserData.bind(this);
    this.getAllUsers = user.getAllUsers.bind(this);
    this.replenishUserStorage = user.replenishUserStorage.bind(this);
    this.withdrawFromUserStorage = user.withdrawFromUserStorage.bind(this);

    this.findSubscriptionAddress =
      subscription.findSubscriptionAddress.bind(this);
    this.getSubscriptionData = subscription.getSubscriptionData.bind(this);
    this.getAllSubscriptions = subscription.getAllSubscriptions.bind(this);
    this.activateSubscription = subscription.activateSubscription.bind(this);
    this.deactivateSubscription =
      subscription.deactivateSubscription.bind(this);
    this.chargeSubscriptionPayment =
      subscription.chargeSubscriptionPayment.bind(this);
  }

  public async checkOrCreateATA(
    mint: PublicKey,
    owner: PublicKey,
    allowOwnerOffCurve = false
  ): Promise<PublicKey> {
    const associatedToken = getAssociatedTokenAddressSync(
      mint,
      owner,
      allowOwnerOffCurve,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const computeBudgetTx = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: this.computeUnitPrice,
    });

    try {
      await getAccount(this.program.provider.connection, associatedToken);
    } catch (error: unknown) {
      if (
        error instanceof TokenAccountNotFoundError ||
        error instanceof TokenInvalidAccountOwnerError
      ) {
        const transaction = new Transaction()
          .add(computeBudgetTx)
          .add(
            createAssociatedTokenAccountInstruction(
              owner,
              associatedToken,
              owner,
              mint,
              TOKEN_PROGRAM_ID,
              ASSOCIATED_TOKEN_PROGRAM_ID
            )
          );

        const txSignature = await this.program.provider.sendAndConfirm(
          transaction
        );

        await this.program.provider.connection.confirmTransaction(
          txSignature,
          "confirmed"
        );
      } else {
        throw error;
      }
    }

    return associatedToken;
  }

  async sendSigned(tx: MethodsBuilder<SubService, any>, wallet?: Signer) {
    const instruction = await tx.instruction();
    const computeBudgetIx = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: this.computeUnitPrice,
    });

    const transaction = new Transaction().add(computeBudgetIx).add(instruction);

    const signers = wallet ? [wallet] : [];

    const txSignature = await this.program.provider.sendAndConfirm(
      transaction,
      signers
    );

    return await this.program.provider.connection.confirmTransaction(
      txSignature,
      "confirmed"
    );
  }

  public findContractServiceAddress(id: string): any {}
  public async getContractServiceData(id: string): Promise<any> {}
  public async getAllServices(): Promise<any> {}
  public async createService(
    id: string,
    authority: PublicKey,
    paymentDelegate: PublicKey,
    mint: PublicKey,
    sub_price: BN,
    wallet?: Signer
  ): Promise<any> {}
  public async removeService(id: string, wallet?: Signer): Promise<any> {}
  public async updateServiceAuthority(
    id: string,
    authority: PublicKey,
    wallet?: Signer
  ): Promise<any> {}
  public async updateServiceMint(
    id: string,
    mint: PublicKey,
    wallet?: Signer
  ): Promise<any> {}
  public async updateServicePrice(
    id: string,
    price: BN,
    wallet?: Signer
  ): Promise<any> {}
  public async withdrawFromServiceStorage(
    id: string,
    amount: BN,
    wallet?: Signer
  ): Promise<any> {}

  public findUserAddress(address: PublicKey): any {}
  public async getUserData(address: PublicKey): Promise<any> {}
  public async getAllUsers(): Promise<any> {}
  public async replenishUserStorage(
    mint: PublicKey,
    amount: BN,
    wallet?: Signer
  ): Promise<any> {}
  public async withdrawFromUserStorage(
    mint: PublicKey,
    amount: BN,
    wallet?: Signer
  ): Promise<any> {}

  public async findSubscriptionAddress(
    user_address: PublicKey,
    service_id: string
  ): Promise<any> {}
  public async getSubscriptionData(
    user_address: PublicKey,
    service_id: string
  ): Promise<any> {}
  public async getAllSubscriptions(): Promise<any> {}
  public async activateSubscription(
    service_id: string,
    wallet?: Signer
  ): Promise<any> {}
  public async deactivateSubscription(
    service_id: string,
    wallet?: Signer
  ): Promise<any> {}
  public async chargeSubscriptionPayment(
    service_id: string,
    wallet?: Signer
  ): Promise<any> {}
}
