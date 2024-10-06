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
  paymentDelegate: PublicKey,
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
        paymentDelegate,
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
    this.program.methods.setServiceAuthority(stateAuthority).accounts({
      authority,
      state,
      programAccount: this.program.programId,
      programData,
    }),
    wallet
  );
}

export async function updateStatePaymentDelegate(
  delegate: PublicKey,
  wallet?: Signer
) {
  const [state] = this.findContractStateAddress();
  const [programData] = this.findProgramDataAddress();
  const authority = wallet ? wallet.publicKey : this.program.provider.publicKey;

  return await this.sendSigned(
    this.program.methods.setStatePaymentDelegate(delegate).accounts({
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
    this.program.methods.setStateCommissionOwner(owner).accounts({
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
    this.program.methods.setStateCommission(commission).accounts({
      authority,
      state,
      programAccount: this.program.programId,
      programData,
    }),
    wallet
  );
}
