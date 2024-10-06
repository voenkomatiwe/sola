import { AnchorProvider, Program, Wallet, web3 } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { Connection, PublicKey } from "@solana/web3.js";
import { parse } from "uuid";

import { IDL, SubService } from "./idl";
import { bufferFromString } from "./utils";

export class ContractBase {
  protected program: Program<SubService>;
  protected connection: Connection;
  protected wallet: NodeWallet;

  constructor(
    connection: web3.Connection,
    wallet: Wallet,
    contractAddress: string,
  ) {
    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    this.program = new Program(IDL, new PublicKey(contractAddress), provider);
    this.wallet = wallet;
    this.connection = connection;
  }

  public findContractServiceAddress(id: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [bufferFromString("service"), parse(id)],
      this.program.programId,
    );
  }

  public findUserAddress(address: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [bufferFromString("user"), address.toBytes()],
      this.program.programId,
    );
  }
}
