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

import * as state from "./state";
import * as service from "./service";
import * as user from "./user";
import * as subscription from "./subscription";

export class SubServiceProgram {
  program: Program<SubService>;
  programId: PublicKey;
  computeUnitPrice: number;

  constructor(
    subServiceProgramId?: string | PublicKey,
    provider?: AnchorProvider,
    computeUnitPrice?: number
  ) {
    this.programId =
      typeof subServiceProgramId === "string"
        ? new PublicKey(subServiceProgramId)
        : subServiceProgramId;

    this.program = new Program(IDL, this.programId, provider);

    // Default compute unit price is 10,000 microlamports
    this.computeUnitPrice = computeUnitPrice || 10000;
    this.setMethods();
  }

  setMethods() {
    this.findContractStateAddress = state.findContractStateAddress.bind(this);
    this.getContractStateData = state.getContractStateData.bind(this);
    this.initializeContractState = state.initializeContractState.bind(this);
    this.updateStateAuthority = state.updateStateAuthority.bind(this);
    this.updateStateWithdrawDelegate =
      state.updateStateWithdrawDelegate.bind(this);
    this.updateStateCommissionOwner =
      state.updateStateCommissionOwner.bind(this);
    this.updateStateCommission = state.updateStateCommission.bind(this);

    this.findServiceAddress = service.findServiceAddress.bind(this);
    this.getServiceData = service.getServiceData.bind(this);
    this.getAllServices = service.getAllServices.bind(this);
    this.createService = service.createService.bind(this);
    this.removeService = service.removeService.bind(this);
    this.updateServiceAuthority = service.updateServiceAuthority.bind(this);
    this.updateServiceMint = service.updateServiceMint.bind(this);
    this.updateServicePrice = service.updateServicePrice.bind(this);
    this.updateServiceSubscriptionPeriod =
      service.updateServiceSubscriptionPeriod.bind(this);
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

  public findProgramDataAddress() {
    return PublicKey.findProgramAddressSync(
      [this.programId.toBytes()],
      new PublicKey("BPFLoaderUpgradeab1e11111111111111111111111")
    );
  }

  public async checkOrCreateATA(
    mint: PublicKey,
    owner: PublicKey,
    wallet: Signer,
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
              wallet.publicKey,
              associatedToken,
              owner,
              mint,
              TOKEN_PROGRAM_ID,
              ASSOCIATED_TOKEN_PROGRAM_ID
            )
          );

        const txSignature = await this.program.provider.sendAndConfirm(
          transaction,
          [wallet]
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

  public findContractStateAddress(id: string): any {}
  public async getContractStateData(id: string): Promise<any> {}
  public async initializeContractState(
    stateAuthority: PublicKey,
    withdrawDelegate: PublicKey,
    commissionOwner: PublicKey,
    commission: BN,
    wallet?: Signer
  ): Promise<any> {}
  public async updateStateAuthority(
    stateAuthority: PublicKey,
    wallet?: Signer
  ): Promise<any> {}
  public async updateStateWithdrawDelegate(
    withdrawDelegate: PublicKey,
    wallet?: Signer
  ): Promise<any> {}
  public async updateStateCommissionOwner(
    commissionOwner: PublicKey,
    wallet?: Signer
  ): Promise<any> {}
  public async updateStateCommission(
    commission: BN,
    wallet?: Signer
  ): Promise<any> {}

  public findServiceAddress(id: string): any {}
  public async getServiceData(id: string): Promise<any> {}
  public async getAllServices(): Promise<any> {}
  public async createService(
    id: string,
    authority: PublicKey,
    mint: PublicKey,
    sub_price: BN,
    subscriptionPeriod?: BN,
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
  public async updateServiceSubscriptionPeriod(
    id: string,
    period: BN,
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

  public findSubscriptionAddress(
    user_address: PublicKey,
    service_id: string
  ): any {}
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
