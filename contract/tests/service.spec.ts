import { web3, BN, AnchorProvider, setProvider } from "@coral-xyz/anchor";
import {
  createAssociatedTokenAccount,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { v1 as uuidv1, v4 as uuidv4 } from "uuid";

import { expectThrowError } from "./util/console";
import { programError } from "./util/error";
import { TestToken } from "./util/token";
import {
  airdrop,
  calculateFeeAmount,
  DEFAULT_SUBSCRIPTION_PERIOD,
  TEST_ID,
} from "./util/setup";

import {
  ACCOUNT_SIZE,
  bufferFromString,
  SubServiceProgram,
  uuidToBn,
} from "../lib";

describe("Service", () => {
  const provider = AnchorProvider.env();
  setProvider(provider);

  const program = new SubServiceProgram(TEST_ID);

  const authority = web3.Keypair.generate();
  const user = web3.Keypair.generate();
  const another_authority = web3.Keypair.generate();
  const commission_owner = web3.Keypair.generate();

  let amount = new BN(100);
  const commission = new BN(500);
  const id = uuidv4();
  const serviceId = uuidToBn(id);

  let testMint: TestToken;
  let newTestMint: TestToken;

  beforeAll(async () => {
    testMint = new TestToken(provider);
    await testMint.mint(1_000_000_000);

    newTestMint = new TestToken(provider);
    await newTestMint.mint(1_000_000_000);

    await airdrop(provider.connection, authority.publicKey);
    await airdrop(provider.connection, user.publicKey);
    await airdrop(provider.connection, another_authority.publicKey);

    try {
      await program.initializeContractState(
        authority.publicKey,
        authority.publicKey,
        commission_owner.publicKey,
        amount
      );
    } catch (e) {
      await program.updateStateCommissionOwner(commission_owner.publicKey);
      await program.updateStateCommission(commission);
    }
  });

  describe("create_service", () => {
    it("fail - invalid service id", async () => {
      const invalidId = bufferFromString("invalid-id", 16);
      const [serviceAccount, bump] = web3.PublicKey.findProgramAddressSync(
        [bufferFromString("service"), invalidId],
        program.programId
      );

      await expectThrowError(
        () =>
          program.program.methods
            .createService(
              new BN(invalidId, "be"),
              authority.publicKey,
              null,
              amount,
              bump
            )
            .accounts({
              sender: user.publicKey,
              service: serviceAccount,
              mint: testMint.token,
              systemProgram: web3.SystemProgram.programId,
            })
            .signers([user])
            .rpc(),
        programError("InvalidUUID")
      );
    });

    it("fail - wrong id version", async () => {
      const invalidId = uuidv1();
      const [serviceAccount, bump] = program.findServiceAddress(invalidId);

      await expectThrowError(
        () =>
          program.program.methods
            .createService(
              uuidToBn(invalidId),
              authority.publicKey,
              null,
              amount,
              bump
            )
            .accounts({
              sender: user.publicKey,
              service: serviceAccount,
              mint: testMint.token,
              systemProgram: web3.SystemProgram.programId,
            })
            .signers([user])
            .rpc(),
        programError("InvalidUUID")
      );
    });

    it("success", async () => {
      const [serviceAccount, bump] = program.findServiceAddress(id);

      await program.program.methods
        .createService(serviceId, authority.publicKey, null, amount, bump)
        .accounts({
          sender: user.publicKey,
          service: serviceAccount,
          mint: testMint.token,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc();

      const fetchedServiceAccount = await program.getServiceData(id);

      expect((fetchedServiceAccount.id as BN).eq(serviceId)).toBeTruthy();
      expect(fetchedServiceAccount.authority).toEqual(authority.publicKey);
      expect(
        fetchedServiceAccount.subscriptionPeriod.eq(DEFAULT_SUBSCRIPTION_PERIOD)
      ).toBeTruthy();
      expect(fetchedServiceAccount.mint).toEqual(testMint.token);
      expect(fetchedServiceAccount.subPrice.eq(amount)).toBeTruthy();
      expect(fetchedServiceAccount.subscribersCount.isZero()).toBeTruthy();
      expect(fetchedServiceAccount.bump).toEqual(bump);

      const serviceInfo = await provider.connection.getAccountInfoAndContext(
        serviceAccount
      );

      expect(serviceInfo.value.owner).toEqual(program.programId);
      expect(serviceInfo.value.data.length).toEqual(ACCOUNT_SIZE.service);
    });
  });

  describe("withdraw_from_service_storage", () => {
    it("fail - authority mismatch", async () => {
      const [serviceAccount] = program.findServiceAddress(id);
      const [state] = program.findContractStateAddress();

      let serviceTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        serviceAccount,
        true
      );

      let senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        authority.publicKey
      );

      let commissionOwnerTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        commission_owner.publicKey
      );

      await expectThrowError(
        () =>
          program.program.methods
            .withdrawFromServiceStorage(amount)
            .accounts({
              sender: another_authority.publicKey,
              service: serviceAccount,
              state,
              senderTokenAccount: senderTokenAccount.address,
              serviceTokenAccount: serviceTokenAccount.address,
              commissionOwnerTokenAccount: commissionOwnerTokenAccount.address,
            })
            .signers([another_authority])
            .rpc(),
        programError("AuthorityMismatch")
      );
    });

    it("fail - invalid sender token account mint", async () => {
      const [serviceAccount] = program.findServiceAddress(id);
      const [state] = program.findContractStateAddress();

      let serviceTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        serviceAccount,
        true
      );

      let senderTokenAccount = await createAssociatedTokenAccount(
        provider.connection,
        user,
        newTestMint.token,
        authority.publicKey
      );

      let commissionOwnerTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        commission_owner.publicKey
      );

      await expectThrowError(
        () =>
          program.program.methods
            .withdrawFromServiceStorage(amount)
            .accounts({
              sender: authority.publicKey,
              service: serviceAccount,
              state,
              senderTokenAccount: senderTokenAccount,
              serviceTokenAccount: serviceTokenAccount.address,
              commissionOwnerTokenAccount: commissionOwnerTokenAccount.address,
            })
            .signers([authority])
            .rpc(),
        programError("InvalidToken")
      );
    });

    it("fail - invalid sender token account owner", async () => {
      const [serviceAccount] = program.findServiceAddress(id);
      const [state] = program.findContractStateAddress();

      let serviceTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        serviceAccount,
        true
      );

      let senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        user.publicKey
      );

      let commissionOwnerTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        commission_owner.publicKey
      );

      await expectThrowError(
        () =>
          program.program.methods
            .withdrawFromServiceStorage(amount)
            .accounts({
              sender: authority.publicKey,
              service: serviceAccount,
              state,
              senderTokenAccount: senderTokenAccount.address,
              serviceTokenAccount: serviceTokenAccount.address,
              commissionOwnerTokenAccount: commissionOwnerTokenAccount.address,
            })
            .signers([authority])
            .rpc(),
        programError("IllegalOwner")
      );
    });

    it("fail - invalid service token account mint", async () => {
      const [serviceAccount] = program.findServiceAddress(id);
      const [state] = program.findContractStateAddress();

      let serviceTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        newTestMint.token,
        serviceAccount,
        true
      );

      let senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        authority.publicKey
      );

      let commissionOwnerTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        commission_owner.publicKey
      );

      await expectThrowError(
        () =>
          program.program.methods
            .withdrawFromServiceStorage(amount)
            .accounts({
              sender: authority.publicKey,
              service: serviceAccount,
              state,
              senderTokenAccount: senderTokenAccount.address,
              serviceTokenAccount: serviceTokenAccount.address,
              commissionOwnerTokenAccount: commissionOwnerTokenAccount.address,
            })
            .signers([authority])
            .rpc(),
        programError("InvalidToken")
      );
    });

    it("fail - invalid commission owner token account mint", async () => {
      const [serviceAccount] = program.findServiceAddress(id);
      const [state] = program.findContractStateAddress();

      let serviceTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        serviceAccount,
        true
      );

      let senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        authority.publicKey
      );

      let commissionOwnerTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        newTestMint.token,
        commission_owner.publicKey
      );

      await expectThrowError(
        () =>
          program.program.methods
            .withdrawFromServiceStorage(amount)
            .accounts({
              sender: authority.publicKey,
              service: serviceAccount,
              state,
              senderTokenAccount: senderTokenAccount.address,
              serviceTokenAccount: serviceTokenAccount.address,
              commissionOwnerTokenAccount: commissionOwnerTokenAccount.address,
            })
            .signers([authority])
            .rpc(),
        programError("InvalidToken")
      );
    });

    it("fail - invalid commission owner token account owner", async () => {
      const [serviceAccount] = program.findServiceAddress(id);
      const [state] = program.findContractStateAddress();

      let serviceTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        serviceAccount,
        true
      );

      let senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        authority.publicKey
      );

      let commissionOwnerTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        user.publicKey
      );

      await expectThrowError(
        () =>
          program.program.methods
            .withdrawFromServiceStorage(amount)
            .accounts({
              sender: authority.publicKey,
              service: serviceAccount,
              state,
              senderTokenAccount: senderTokenAccount.address,
              serviceTokenAccount: serviceTokenAccount.address,
              commissionOwnerTokenAccount: commissionOwnerTokenAccount.address,
            })
            .signers([authority])
            .rpc(),
        programError("IllegalOwner")
      );
    });

    it("fail - invalid token balance", async () => {
      const [serviceAccount] = program.findServiceAddress(id);
      const [state] = program.findContractStateAddress();

      let serviceTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        serviceAccount,
        true
      );

      let senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        authority.publicKey
      );

      let commissionOwnerTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        commission_owner.publicKey
      );

      await expectThrowError(
        () =>
          program.program.methods
            .withdrawFromServiceStorage(amount)
            .accounts({
              sender: authority.publicKey,
              service: serviceAccount,
              state,
              senderTokenAccount: senderTokenAccount.address,
              serviceTokenAccount: serviceTokenAccount.address,
              commissionOwnerTokenAccount: commissionOwnerTokenAccount.address,
            })
            .signers([authority])
            .rpc(),
        /Error processing Instruction 0: custom program error: 0x1/
      );
    });

    it("success", async () => {
      const [serviceAccount] = program.findServiceAddress(id);
      const [state] = program.findContractStateAddress();

      await testMint.transfer(null, serviceAccount, amount.toNumber(), true);

      let serviceTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        serviceAccount,
        true
      );

      let senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        authority.publicKey
      );

      let commissionOwnerTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        commission_owner.publicKey
      );

      let senderBalanceBefore = await testMint.getBalance(authority.publicKey);
      let serviceBalanceBefore = await testMint.getBalance(
        serviceAccount,
        true
      );
      let commissionBalanceBefore = await testMint.getBalance(
        commission_owner.publicKey
      );

      await program.program.methods
        .withdrawFromServiceStorage(amount)
        .accounts({
          sender: authority.publicKey,
          service: serviceAccount,
          state,
          senderTokenAccount: senderTokenAccount.address,
          serviceTokenAccount: serviceTokenAccount.address,
          commissionOwnerTokenAccount: commissionOwnerTokenAccount.address,
        })
        .signers([authority])
        .rpc();

      let fee = calculateFeeAmount(amount, commission);

      let senderBalanceAfter = await testMint.getBalance(authority.publicKey);
      let serviceBalanceAfter = await testMint.getBalance(serviceAccount, true);
      let commissionBalancAfter = await testMint.getBalance(
        commission_owner.publicKey
      );

      expect(
        commissionBalancAfter.eq(commissionBalanceBefore.add(fee))
      ).toBeTruthy();
      expect(
        senderBalanceAfter.eq(senderBalanceBefore.add(amount.sub(fee)))
      ).toBeTruthy();
      expect(
        serviceBalanceAfter.eq(serviceBalanceBefore.sub(amount))
      ).toBeTruthy();
    });
  });

  describe("update_service", () => {
    it("fail - authority mismatch", async () => {
      const [serviceAccount] = program.findServiceAddress(id);

      await expectThrowError(
        () =>
          program.program.methods
            .updateServiceAuthority(another_authority.publicKey)
            .accounts({
              sender: another_authority.publicKey,
              service: serviceAccount,
            })
            .signers([another_authority])
            .rpc(),
        programError("AuthorityMismatch")
      );
    });

    it("success - update service mint", async () => {
      const [serviceAccount] = program.findServiceAddress(id);

      await program.program.methods
        .updateServiceMint(newTestMint.token)
        .accounts({
          sender: authority.publicKey,
          service: serviceAccount,
        })
        .signers([authority])
        .rpc();

      const fetchedServiceAccount = await program.getServiceData(id);

      expect(fetchedServiceAccount.mint).toEqual(newTestMint.token);
    });

    it("success - update service price", async () => {
      const [serviceAccount] = program.findServiceAddress(id);

      amount = amount.addn(100);

      await program.program.methods
        .updateServicePrice(amount)
        .accounts({
          sender: authority.publicKey,
          service: serviceAccount,
        })
        .signers([authority])
        .rpc();

      const fetchedServiceAccount = await program.getServiceData(id);

      expect(fetchedServiceAccount.subPrice.eq(amount)).toBeTruthy();
    });

    it("success - update subscription period", async () => {
      const [serviceAccount] = program.findServiceAddress(id);
      const period = new BN(12345);

      await program.program.methods
        .updateServiceSubscriptionPeriod(period)
        .accounts({
          sender: authority.publicKey,
          service: serviceAccount,
        })
        .signers([authority])
        .rpc();

      const fetchedServiceAccount = await program.getServiceData(id);

      expect(fetchedServiceAccount.subscriptionPeriod.eq(period)).toBeTruthy();
    });

    it("success - update service authority", async () => {
      const [serviceAccount] = program.findServiceAddress(id);

      await program.program.methods
        .updateServiceAuthority(another_authority.publicKey)
        .accounts({
          sender: authority.publicKey,
          service: serviceAccount,
        })
        .signers([authority])
        .rpc();

      const fetchedServiceAccount = await program.getServiceData(id);

      expect(fetchedServiceAccount.authority).toEqual(
        another_authority.publicKey
      );
    });
  });

  describe("remove_service", () => {
    it("fail - authority mismatch", async () => {
      const [serviceAccount] = program.findServiceAddress(id);

      await expectThrowError(
        () =>
          program.program.methods
            .removeService()
            .accounts({
              sender: user.publicKey,
              service: serviceAccount,
              systemProgram: web3.SystemProgram.programId,
            })
            .signers([user])
            .rpc(),
        programError("AuthorityMismatch")
      );
    });

    it("fail - service has subscribers", async () => {
      const [serviceAccount] = program.findServiceAddress(id);

      await newTestMint.transfer(null, user.publicKey, amount.toNumber());
      await program.replenishUserStorage(newTestMint.token, amount, user);
      await program.activateSubscription(id, user);

      await expectThrowError(
        () =>
          program.program.methods
            .removeService()
            .accounts({
              sender: another_authority.publicKey,
              service: serviceAccount,
              systemProgram: web3.SystemProgram.programId,
            })
            .signers([another_authority])
            .rpc(),
        programError("PresentSubscriptions")
      );

      await program.deactivateSubscription(id, user);
    });

    it("success", async () => {
      const [serviceAccount] = program.findServiceAddress(id);

      await program.program.methods
        .removeService()
        .accounts({
          sender: another_authority.publicKey,
          service: serviceAccount,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([another_authority])
        .rpc();

      await expectThrowError(
        () => program.program.account.service.fetch(serviceAccount),
        /Account does not exist or has no data/
      );
    });
  });
});
