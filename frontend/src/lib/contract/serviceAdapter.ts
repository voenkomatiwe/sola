import { BN, Wallet, web3 } from "@coral-xyz/anchor";
import { PublicKey, Signer, Transaction } from "@solana/web3.js";
import { parse, parse as uuidParse } from "uuid";

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

  public async createService(
    id: string,
    authority: PublicKey,
    paymentDelegate: PublicKey,
    mint: PublicKey,
    subPrice: BN,
  ) {
    const [service, bump] = this.findContractServiceAddress(id);
    const sender = this.program.provider.publicKey;
    console.log(sender);
    const createServiceInstruction = await this.program.methods
      .createService(
        new BN(parse(id), "be"),
        authority,
        paymentDelegate,
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
    if (this.program.provider.sendAndConfirm) {
      const tx =
        await this.program.provider.sendAndConfirm(transferTransaction);
      return tx;
    }
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */

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
