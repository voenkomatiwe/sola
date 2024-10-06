import * as anchor from "@coral-xyz/anchor";
import { web3, BN } from "@coral-xyz/anchor";
import { v4 as uuidv4 } from "uuid";

import { TEST_ID, airdrop, ignoreIfExist } from "./util/setup";
import { TestToken } from "./util/token";
import { SubServiceProgram } from "../lib";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";

describe("Sub Contract General Test", () => {
  const program = new SubServiceProgram(TEST_ID);

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const authority = provider.wallet;
  const user = web3.Keypair.generate();
  const another_authority = web3.Keypair.generate();
  const commission_owner = web3.Keypair.generate();
  const payment_delegate = web3.Keypair.generate();

  let amount = new BN(100);
  const commission = new BN(500);
  const period = new BN(0);
  const id = uuidv4();

  const name = "Test service";
  const url = "my-service.com.ua";

  let testMint: TestToken;

  beforeAll(async () => {
    testMint = new TestToken(provider);
    await testMint.mint(1_000_000_000);

    await airdrop(provider.connection, user.publicKey);
    await airdrop(provider.connection, another_authority.publicKey);
    await airdrop(provider.connection, commission_owner.publicKey);
    await airdrop(provider.connection, payment_delegate.publicKey);

    await testMint.transfer(null, user.publicKey, amount.muln(3).toNumber());

    await getOrCreateAssociatedTokenAccount(
      provider.connection,
      user,
      testMint.token,
      commission_owner.publicKey
    );
  });

  it("initialize contract state", async () => {
    await ignoreIfExist(() =>
      program.initializeContractState(
        authority.publicKey,
        authority.publicKey,
        authority.publicKey,
        commission
      )
    );
  });

  it("update contract state", async () => {
    await program.updateStateAuthority(authority.publicKey);
    await program.updateStatePaymentDelegate(payment_delegate.publicKey);
    await program.updateStateCommissionOwner(commission_owner.publicKey);
    await program.updateStateCommission(commission);
  });

  it("replenish user storage", async () => {
    await program.replenishUserStorage(testMint.token, amount, user);
  });

  it("withdraw from user storage", async () => {
    await program.withdrawFromUserStorage(testMint.token, amount, user);
  });

  it("create service", async () => {
    await program.createService(
      id,
      name,
      url,
      another_authority.publicKey,
      testMint.token,
      amount
    );
  });

  it("activate user subscription", async () => {
    await program.replenishUserStorage(testMint.token, amount, user);
    await program.activateSubscription(id, user);
  });

  it("update service", async () => {
    await program.updateServiceAuthority(
      id,
      authority.publicKey,
      another_authority
    );
    await program.updateServiceSubscriptionPeriod(id, period);
    await program.updateServiceMint(id, testMint.token);
    await program.updateServicePrice(id, amount);
  });

  it("charge subscription payment", async () => {
    await program.replenishUserStorage(testMint.token, amount, user);
    await program.chargeSubscriptionPayment(
      id,
      user.publicKey,
      payment_delegate
    );
  });

  it("deactivate user subscription", async () => {
    await program.deactivateSubscription(id, user);
  });

  it("withdraw from service storage", async () => {
    await program.withdrawFromServiceStorage(id, amount);
  });

  it("remove service", async () => {
    await program.removeService(id);
  });
});
