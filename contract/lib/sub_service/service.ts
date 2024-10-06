import { BN, web3 } from "@coral-xyz/anchor";
import { PublicKey, Signer } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { parse as uuidParse } from "uuid";

import { bufferFromString, uuidToBn } from "..";

export function findServiceAddress(id: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("service"), uuidParse(id)],
    this.programId
  );
}

export async function getServiceData(id: string) {
  const [service] = this.findServiceAddress(id);

  return await this.program.account.service.fetch(service);
}

export async function getAllServices() {
  return await this.program.account.service.all();
}

export async function createService(
  id: string,
  name: string,
  url: string,
  authority: PublicKey,
  mint: PublicKey,
  sub_price: BN,
  subscriptionPeriod?: BN,
  wallet?: Signer
) {
  const [service, bump] = this.findServiceAddress(id);
  const sender = wallet ? wallet.publicKey : this.program.provider.publicKey;
  const period = subscriptionPeriod || null;

  const nameBuffer = Array.from(bufferFromString(name, 32));
  const urlBuffer = Array.from(bufferFromString(url, 32));

  return await this.sendSigned(
    this.program.methods
      .createService(
        uuidToBn(id),
        nameBuffer,
        urlBuffer,
        authority,
        period,
        sub_price,
        bump
      )
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
  const [service] = this.findServiceAddress(id);
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
  const [service] = this.findServiceAddress(id);
  const sender = wallet ? wallet.publicKey : this.program.provider.publicKey;

  return await this.sendSigned(
    this.program.methods.updateServiceAuthority(authority).accounts({
      sender,
      service,
    }),
    wallet
  );
}

export async function updateServiceSubscriptionPeriod(
  id: string,
  period: BN,
  wallet?: Signer
) {
  const [service] = this.findServiceAddress(id);
  const sender = wallet ? wallet.publicKey : this.program.provider.publicKey;

  return await this.sendSigned(
    this.program.methods.updateServiceSubscriptionPeriod(period).accounts({
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
  const [service] = this.findServiceAddress(id);
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
  const [service] = this.findServiceAddress(id);
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
  const [service] = this.findServiceAddress(id);
  const sender = wallet ? wallet.publicKey : this.program.provider.publicKey;
  const [state] = this.findContractStateAddress();
  const serviceData = await this.getServiceData(id);
  const stateData = await this.getContractStateData();

  const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
    this.program.provider.connection,
    wallet,
    serviceData.mint,
    sender
  );

  const serviceTokenAccount = await getAssociatedTokenAddress(
    serviceData.mint,
    service,
    true
  );

  const commissionOwnerTokenAccount = await getOrCreateAssociatedTokenAccount(
    this.program.provider.connection,
    wallet,
    serviceData.mint,
    stateData.commissionOwner
  );

  return await this.sendSigned(
    this.program.methods.withdrawFromServiceStorage(amount).accounts({
      sender,
      service,
      state,
      senderTokenAccount: senderTokenAccount.address,
      serviceTokenAccount: serviceTokenAccount,
      commissionOwnerTokenAccount: commissionOwnerTokenAccount.address,
      tokenProgram: TOKEN_PROGRAM_ID,
    }),
    wallet
  );
}
