import { BN, web3 } from "@coral-xyz/anchor";
import { PublicKey, Signer } from "@solana/web3.js";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { parse as uuidParse } from "uuid";

import { bufferFromString, uuidToBn } from "..";

export function findContractServiceAddress(id: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [bufferFromString("service"), uuidParse(id)],
    this.programId
  );
}

export async function getContractServiceData(id: string) {
  const [service] = this.getContractServiceData(id);

  return await this.program.account.service.fetch(service);
}

export async function getAllServices() {
  return await this.program.account.service.all();
}

export async function createService(
  id: string,
  authority: PublicKey,
  paymentDelegate: PublicKey,
  mint: PublicKey,
  sub_price: BN,
  wallet?: Signer
) {
  const [service, bump] = this.findContractServiceAddress(id);
  const sender = wallet ? wallet.publicKey : this.program.provider.publicKey;

  return await this.sendSigned(
    this.program.methods
      .createService(uuidToBn(id), authority, paymentDelegate, sub_price, bump)
      .accounts({
        sender,
        service,
        mint,
        systemProgram: web3.SystemProgram.programId,
      }),
    wallet
  );
}

export async function removeService(id: string, wallet?: Signer) {
  const [service] = this.findContractServiceAddress(id);
  const sender = wallet ? wallet.publicKey : this.program.provider.publicKey;

  return await this.sendSigned(
    this.program.methods.removeService().accounts({
      sender,
      service,
      systemProgram: web3.SystemProgram.programId,
    }),
    wallet
  );
}

export async function updateServiceAuthority(
  id: string,
  authority: PublicKey,
  wallet?: Signer
) {
  const [service] = this.findContractServiceAddress(id);
  const sender = wallet ? wallet.publicKey : this.program.provider.publicKey;

  return await this.sendSigned(
    this.program.methods.updateServiceAuthority(authority).accounts({
      sender,
      service,
    }),
    wallet
  );
}

export async function updatePaymentDelegate(
  id: string,
  delegate: PublicKey,
  wallet?: Signer
) {
  const [service] = this.findContractServiceAddress(id);
  const sender = wallet ? wallet.publicKey : this.program.provider.publicKey;

  return await this.sendSigned(
    this.program.methods.updatePaymentDelegate(delegate).accounts({
      sender,
      service,
    }),
    wallet
  );
}

export async function updateServiceMint(
  id: string,
  mint: PublicKey,
  wallet?: Signer
) {
  const [service] = this.findContractServiceAddress(id);
  const sender = wallet ? wallet.publicKey : this.program.provider.publicKey;

  return await this.sendSigned(
    this.program.methods.updateServiceMint(mint).accounts({
      sender,
      service,
    }),
    wallet
  );
}

export async function updateServicePrice(
  id: string,
  price: BN,
  wallet?: Signer
) {
  const [service] = this.findContractServiceAddress(id);
  const sender = wallet ? wallet.publicKey : this.program.provider.publicKey;

  return await this.sendSigned(
    this.program.methods.updateServicePrice(price).accounts({
      sender,
      service,
    }),
    wallet
  );
}

export async function withdrawFromServiceStorage(
  id: string,
  amount: BN,
  wallet?: Signer
) {
  const [service] = this.findContractServiceAddress(id);
  const sender = wallet ? wallet.publicKey : this.program.provider.publicKey;
  const data = await this.getContractServiceData(id);

  const senderTokenAccount = await this.checkOrCreateATA(data.mint, sender);
  const serviceTokenAccount = await getAssociatedTokenAddress(
    data.mint,
    service,
    true
  );

  return await this.sendSigned(
    this.program.methods.withdrawFromServiceStorage(amount).accounts({
      sender,
      service,
      senderTokenAccount,
      serviceTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
    }),
    wallet
  );
}
