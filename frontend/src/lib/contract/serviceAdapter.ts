import { BN, Wallet, web3 } from "@coral-xyz/anchor";
import { PublicKey, Transaction } from "@solana/web3.js";
import { parse } from "uuid";

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

  public async getContractServiceData(id: string) {
    const [serviceAddress] = this.findContractServiceAddress(id);
    return await this.program.account.service.fetch(serviceAddress);
  }

  public async getAllServices() {
    return await this.program.account.service.all();
  }

  public async createService({
    id,
    authority,
    mint,
    subPrice,
    subscriptionPeriod,
    name,
    url,
  }: {
    id: string;
    authority: PublicKey;
    mint: PublicKey;
    name: string;
    url: string;
    subPrice: BN;
    subscriptionPeriod?: BN;
  }) {
    const [service, bump] = this.findContractServiceAddress(id);
    const sender = this.program.provider.publicKey;

    const nameBuffer = Array.from(bufferFromString(name, 32));
    const urlBuffer = Array.from(bufferFromString(url, 32));
    const period = subscriptionPeriod || null;
    const createServiceInstruction = await this.program.methods
      .createService(
        new BN(parse(id), "be"),
        nameBuffer,
        urlBuffer,
        authority,
        period,
        subPrice,
        bump,
      )
      .accounts({
        sender,
        service,
        mint,
        systemProgram: web3.SystemProgram.programId,
      })
      .instruction();
    const transferTransaction = new Transaction().add(createServiceInstruction);
    transferTransaction.feePayer = sender;
    if (!this.program.provider.simulate) return;
    const validate =
      await this.connection.simulateTransaction(transferTransaction);

    console.log("validate transferTransaction", validate);
    if (this.program.provider.sendAndConfirm) {
      const tx =
        await this.program.provider.sendAndConfirm(transferTransaction);
      return tx;
    }
  }

  // public async removeService(id: string, wallet?: Signer) {}

  // public async updateServiceAuthority(
  //   id: string,
  //   authority: PublicKey,
  //   wallet?: Signer,
  // ) {}

  // public async updateServiceMint(
  //   id: string,
  //   mint: PublicKey,
  //   wallet?: Signer,
  // ) {}

  // public async updateServicePrice(id: string, price: BN, wallet?: Signer) {}

  // public async withdrawFromServiceStorage(
  //   id: string,
  //   amount: BN,
  //   wallet?: Signer,
  // ) {}
}
