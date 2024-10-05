import { AnchorProvider, Program, Wallet, web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

import { IDL, SubService } from "./idl";

export class ContractBase {
  protected program: Program<SubService>;

  constructor(
    connection: web3.Connection,
    wallet: Wallet,
    contractAddress: string,
  ) {
    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    this.program = new Program(IDL, new PublicKey(contractAddress), provider);
  }
}
