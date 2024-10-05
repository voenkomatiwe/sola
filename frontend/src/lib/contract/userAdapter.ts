import { BN, Wallet, web3 } from "@coral-xyz/anchor";
import { PublicKey, Signer } from "@solana/web3.js";

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

  /* eslint-disable @typescript-eslint/no-unused-vars */
  public async replenishUserStorage(
    mint: PublicKey,
    amount: BN,
    wallet?: Signer,
  ) {}

  public async withdrawFromUserStorage(
    mint: PublicKey,
    amount: BN,
    wallet?: Signer,
  ) {}
}
