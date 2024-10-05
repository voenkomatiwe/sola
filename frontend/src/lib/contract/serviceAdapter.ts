import { BN, Wallet, web3 } from "@coral-xyz/anchor";
import { PublicKey, Signer } from "@solana/web3.js";
import { parse as uuidParse } from "uuid";

import { ContractBase } from "./baseAdapter";
import { bufferFromString } from "./utils";

export class ServiceAdapter extends ContractBase {
  constructor(
    connection: web3.Connection,
    wallet: Wallet,
    contractAddress: string,
  ) {
    super(connection, wallet, contractAddress);
  }

  public findContractServiceAddress(id: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [bufferFromString("service"), uuidParse(id)],
      this.program.programId,
    );
  }

  public async getContractServiceData(id: string) {
    const [serviceAddress] = this.findContractServiceAddress(id);
    return await this.program.account.service.fetch(serviceAddress);
  }

  public async getAllServices() {
    return await this.program.account.service.all();
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  public async createService(
    id: string,
    authority: PublicKey,
    paymentDelegate: PublicKey,
    mint: PublicKey,
    subPrice: BN,
    wallet?: Signer,
  ) {}

  public async removeService(id: string, wallet?: Signer) {}

  public async updateServiceAuthority(
    id: string,
    authority: PublicKey,
    wallet?: Signer,
  ) {}

  public async updateServiceMint(
    id: string,
    mint: PublicKey,
    wallet?: Signer,
  ) {}

  public async updateServicePrice(id: string, price: BN, wallet?: Signer) {}

  public async withdrawFromServiceStorage(
    id: string,
    amount: BN,
    wallet?: Signer,
  ) {}
}
