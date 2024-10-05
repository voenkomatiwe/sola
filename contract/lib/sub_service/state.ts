import { BN, web3 } from "@coral-xyz/anchor";
import { PublicKey, Signer } from "@solana/web3.js";
import { bufferFromString } from "..";

export function findContractStateAddress(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [bufferFromString("state")],
    this.programId
  );
}

export async function getContractStateData() {
  const [admin] = this.findContractStateAddress();

  return await this.program.account.state.fetch(admin);
}

export async function initializeContractState(
  stateAuthority: PublicKey,
  withdrawDelegate: PublicKey,
  commissionOwner: PublicKey,
  commission: BN,
  wallet?: Signer
) {
  const [state, bump] = this.findContractStateAddress();
  const [programData] = this.findProgramDataAddress();
  const authority = wallet ? wallet.publicKey : this.program.provider.publicKey;

  return await this.sendSigned(
    this.program.methods
      .initializeContractState(
        stateAuthority,
        withdrawDelegate,
        commissionOwner,
        commission,
        bump
      )
      .accounts({
        authority,
        state,
        programAccount: this.program.programId,
        programData,
        systemProgram: web3.SystemProgram.programId,
      }),
    wallet
  );
}

export async function updateStateAuthority(
  stateAuthority: PublicKey,
  wallet?: Signer
) {
  const [state] = this.findContractStateAddress();
  const [programData] = this.findProgramDataAddress();
  const authority = wallet ? wallet.publicKey : this.program.provider.publicKey;

  return await this.sendSigned(
    this.program.methods.updateServiceAuthority(stateAuthority).accounts({
      authority,
      state,
      programAccount: this.program.programId,
      programData,
    }),
    wallet
  );
}

export async function updateStateWithdrawDelegate(
  delegate: PublicKey,
  wallet?: Signer
) {
  const [state] = this.findContractStateAddress();
  const [programData] = this.findProgramDataAddress();
  const authority = wallet ? wallet.publicKey : this.program.provider.publicKey;

  return await this.sendSigned(
    this.program.methods.updateStateWithdrawDelegate(delegate).accounts({
      authority,
      state,
      programAccount: this.program.programId,
      programData,
    }),
    wallet
  );
}

export async function updateStateCommissionOwner(
  owner: PublicKey,
  wallet?: Signer
) {
  const [state] = this.findContractStateAddress();
  const [programData] = this.findProgramDataAddress();
  const authority = wallet ? wallet.publicKey : this.program.provider.publicKey;

  return await this.sendSigned(
    this.program.methods.updateStateCommissionOwner(owner).accounts({
      authority,
      state,
      programAccount: this.program.programId,
      programData,
    }),
    wallet
  );
}

export async function updateStateCommission(commission: BN, wallet?: Signer) {
  const [state] = this.findContractStateAddress();
  const [programData] = this.findProgramDataAddress();
  const authority = wallet ? wallet.publicKey : this.program.provider.publicKey;

  return await this.sendSigned(
    this.program.methods.updateStateCommission(commission).accounts({
      authority,
      state,
      programAccount: this.program.programId,
      programData,
    }),
    wallet
  );
}
