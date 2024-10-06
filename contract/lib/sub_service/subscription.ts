import { web3 } from "@coral-xyz/anchor";
import { PublicKey, Signer } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { parse as uuidParse } from "uuid";

import { bufferFromString } from "..";

export function findSubscriptionAddress(
  user_address: PublicKey,
  service_id: string
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      bufferFromString("subscription"),
      user_address.toBytes(),
      uuidParse(service_id),
    ],
    this.programId
  );
}

export async function getSubscriptionData(
  user_address: PublicKey,
  service_id: string
) {
  const [subscription] = this.findSubscriptionAddress(user_address, service_id);

  return await this.program.account.subscription.fetch(subscription);
}

export async function getAllSubscriptions() {
  return await this.program.account.subscription.all();
}

export async function activateSubscription(
  service_id: string,
  wallet?: Signer
) {
  const sender = wallet ? wallet.publicKey : this.program.provider.publicKey;
  const [subscription, bump] = this.findSubscriptionAddress(sender, service_id);
  const [user] = this.findUserAddress(sender);
  const [service] = this.findServiceAddress(service_id);
  const data = await this.getServiceData(service_id);

  const userTokenAccount = await getAssociatedTokenAddress(
    data.mint,
    user,
    true
  );
  const serviceTokenAccount = await getAssociatedTokenAddress(
    data.mint,
    service,
    true
  );

  return await this.sendSigned(
    this.program.methods.activateSubscription(bump).accounts({
      sender,
      subscription,
      user,
      service,
      serviceTokenAccount,
      userTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
    }),
    wallet
  );
}

export async function deactivateSubscription(
  service_id: string,
  wallet?: Signer
) {
  const sender = wallet ? wallet.publicKey : this.program.provider.publicKey;
  const [subscription] = this.findSubscriptionAddress(sender, service_id);
  const [service] = this.findServiceAddress(service_id);

  return await this.sendSigned(
    this.program.methods.deactivateSubscription().accounts({
      sender,
      subscription,
      service,
    }),
    wallet
  );
}

export async function chargeSubscriptionPayment(
  service_id: string,
  userWallet: PublicKey,
  wallet?: Signer
) {
  const sender = wallet ? wallet.publicKey : this.program.provider.publicKey;
  const [state] = this.findContractStateAddress();
  const [subscription] = this.findSubscriptionAddress(userWallet, service_id);
  const [user] = this.findUserAddress(userWallet);
  const [service] = this.findServiceAddress(service_id);
  const data = await this.getServiceData(service_id);

  const userTokenAccount = await getAssociatedTokenAddress(
    data.mint,
    user,
    true
  );
  const serviceTokenAccount = await getAssociatedTokenAddress(
    data.mint,
    sender,
    true
  );

  return await this.sendSigned(
    this.program.methods.chargeSubscriptionPayment().accounts({
      sender,
      subscription,
      user,
      service,
      state,
      serviceTokenAccount,
      userTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
    }),
    wallet
  );
}
