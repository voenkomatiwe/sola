import { Wallet, web3 } from "@coral-xyz/anchor";
import { PublicKey, Signer } from "@solana/web3.js";
import { parse as uuidParse } from "uuid";

import { ContractBase } from "./baseAdapter";
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

  public async getSubscriptionData(userAddress: PublicKey, serviceId: string) {
    const [subscription] = this.findSubscriptionAddress(userAddress, serviceId);
    return await this.program.account.subscription.fetch(subscription);
  }

  public async getAllSubscriptions() {
    return await this.program.account.subscription.all();
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  public async activateSubscription(serviceId: string, wallet?: Signer) {}

  public async deactivateSubscription(serviceId: string, wallet?: Signer) {}

  public async chargeSubscriptionPayment(
    serviceId: string,
    userWallet: PublicKey,
    wallet?: Signer,
  ) {}
}
