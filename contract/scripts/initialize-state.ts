import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import * as dotenv from "dotenv";
import { BN } from "bn.js";

import { SubServiceProgram } from "../lib";
import { errorHandler, logVar, successHandler } from "./util";

dotenv.config();

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

async function main() {
  const [AUTHORITY, payment_delegate, COMMISSION_OWNER, COMMISSION] =
    process.argv.slice(2);
  const programId = process.env.SUB_PROGRAM_ID;

  if (!AUTHORITY || !payment_delegate || !COMMISSION_OWNER || !COMMISSION) {
    throw new Error(
      `Usage: npm run initialize-state <AUTHORITY> <payment_delegate> <COMMISSION_OWNER> <COMMISSION>`
    );
  }

  if (!programId) {
    throw new Error("SUB_PROGRAM_ID is not set");
  }

  const pitchTalk = new SubServiceProgram(programId, provider);

  logVar(`Initializing contract state`, programId);
  logVar(`Authority`, AUTHORITY);
  logVar(`Withdraw delegate`, payment_delegate);
  logVar(`Commission owner`, COMMISSION_OWNER);
  logVar(`Commission`, COMMISSION);

  return await pitchTalk.initializeContractState(
    new PublicKey(AUTHORITY),
    new PublicKey(payment_delegate),
    new PublicKey(COMMISSION_OWNER),
    new BN(COMMISSION)
  );
}

main().then(successHandler).catch(errorHandler);
