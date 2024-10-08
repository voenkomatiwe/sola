import { AnchorProvider, BN, setProvider, web3 } from "@coral-xyz/anchor";
import {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccount,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";

import { ACCOUNT_SIZE, SubServiceProgram } from "../lib";
import { ACCOUNT_SIZE, SubServiceProgram } from "../lib";
import { expectThrowError } from "./util/console";
import { programError } from "./util/error";
import { TEST_ID, airdrop } from "./util/setup";
import { TestToken } from "./util/token";

describe("User", () => {
  const provider = AnchorProvider.env();
  setProvider(provider);

  const program = new SubServiceProgram(TEST_ID);

  const authority = web3.Keypair.generate();
  const user = web3.Keypair.generate();
  const nobody = web3.Keypair.generate();

  const amount = new BN(100);

  let testMint: TestToken;

  beforeAll(async () => {
    testMint = new TestToken(provider);
    await testMint.mint(1_000_000_000);

    await airdrop(provider.connection, authority.publicKey);
    await airdrop(provider.connection, user.publicKey);
    await airdrop(provider.connection, nobody.publicKey);
  });

  describe("replenish_user_storage", () => {
    it("fail - invalid sender token account mint", async () => {
      const [userAccount, bump] = program.findUserAddress(user.publicKey);

      const userTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        userAccount,
        true,
      );

      const newTestMint = new TestToken(provider);
      await newTestMint.mint(1);

      const senderTokenAccount = await createAssociatedTokenAccount(
        provider.connection,
        user,
        newTestMint.token,
        user.publicKey,
      );

      await expectThrowError(
        () =>
          program.program.methods
            .replenishUserStorage(amount, bump)
            .accounts({
              sender: user.publicKey,
              user: userAccount,
              senderTokenAccount,
              userTokenAccount: userTokenAccount.address,
              tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([user])
            .rpc(),
        programError("InvalidToken"),
      );
    });

    it("fail - invalid sender token account owner", async () => {
      const [userAccount, bump] = program.findUserAddress(user.publicKey);

      const userTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        userAccount,
        true,
      );

      const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        nobody,
        testMint.token,
        nobody.publicKey,
      );

      await expectThrowError(
        () =>
          program.program.methods
            .replenishUserStorage(amount, bump)
            .accounts({
              sender: user.publicKey,
              user: userAccount,
              senderTokenAccount: senderTokenAccount.address,
              userTokenAccount: userTokenAccount.address,
              tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([user])
            .rpc(),
        programError("IllegalOwner"),
      );
    });

    it("fail - invalid user token account mint", async () => {
      const [userAccount, bump] = program.findUserAddress(user.publicKey);

      const newTestMint = new TestToken(provider);
      await newTestMint.mint(1);

      const userTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        newTestMint.token,
        userAccount,
        true,
      );

      const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        user.publicKey,
      );

      await expectThrowError(
        () =>
          program.program.methods
            .replenishUserStorage(amount, bump)
            .accounts({
              sender: user.publicKey,
              user: userAccount,
              senderTokenAccount: senderTokenAccount.address,
              userTokenAccount: userTokenAccount.address,
              tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([user])
            .rpc(),
        programError("InvalidToken"),
      );
    });

    it("fail - invalid token balance", async () => {
      const [userAccount, bump] = program.findUserAddress(user.publicKey);

      const userTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        userAccount,
        true,
      );

      const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        user.publicKey,
      );

      await expectThrowError(
        () =>
          program.program.methods
            .replenishUserStorage(amount, bump)
            .accounts({
              sender: user.publicKey,
              user: userAccount,
              senderTokenAccount: senderTokenAccount.address,
              userTokenAccount: userTokenAccount.address,
              tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([user])
            .rpc(),
        /Error processing Instruction 0: custom program error: 0x1/,
      );
    });

    it("success - user created + deposit", async () => {
      const [userAccount, bump] = program.findUserAddress(user.publicKey);

      await testMint.transfer(null, user.publicKey, amount.toNumber());

      const userTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        userAccount,
        true,
      );

      const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        user.publicKey,
      );

      const senderBalanceBefore = await testMint.getBalance(user.publicKey);
      const userBalanceBefore = await testMint.getBalance(userAccount, true);

      await program.program.methods
        .replenishUserStorage(amount, bump)
        .accounts({
          sender: user.publicKey,
          user: userAccount,
          senderTokenAccount: senderTokenAccount.address,
          userTokenAccount: userTokenAccount.address,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([user])
        .rpc();

      const fetchedUserAccount = await program.getUserData(user.publicKey);

      expect(fetchedUserAccount.address).toEqual(user.publicKey);
      expect(fetchedUserAccount.bump).toEqual(bump);

      const userInfo =
        await provider.connection.getAccountInfoAndContext(userAccount);

      expect(userInfo.value.owner).toEqual(program.programId);
      expect(userInfo.value.data.length).toEqual(ACCOUNT_SIZE.user);

      const senderBalanceAfter = await testMint.getBalance(user.publicKey);
      const userBalanceAfter = await testMint.getBalance(userAccount, true);

      expect(
        senderBalanceAfter.eq(senderBalanceBefore.sub(amount)),
      ).toBeTruthy();
      expect(userBalanceAfter.eq(userBalanceBefore.add(amount))).toBeTruthy();
    });

    it("success - existing user deposited", async () => {
      const [userAccount, bump] = program.findUserAddress(user.publicKey);

      await testMint.transfer(null, user.publicKey, amount.toNumber());

      const userTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        userAccount,
        true,
      );

      const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        user.publicKey,
      );

      const senderBalanceBefore = await testMint.getBalance(user.publicKey);
      const userBalanceBefore = await testMint.getBalance(userAccount, true);

      await program.program.methods
        .replenishUserStorage(amount, bump)
        .accounts({
          sender: user.publicKey,
          user: userAccount,
          senderTokenAccount: senderTokenAccount.address,
          userTokenAccount: userTokenAccount.address,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([user])
        .rpc();

      const senderBalanceAfter = await testMint.getBalance(user.publicKey);
      const userBalanceAfter = await testMint.getBalance(userAccount, true);

      expect(
        senderBalanceAfter.eq(senderBalanceBefore.sub(amount)),
      ).toBeTruthy();
      expect(userBalanceAfter.eq(userBalanceBefore.add(amount))).toBeTruthy();
    });
  });

  describe("withdraw_from_user_storage", () => {
    it("fail - authority mismatch", async () => {
      const [userAccount] = program.findUserAddress(user.publicKey);

      const userTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        userAccount,
        true,
      );

      const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        user.publicKey,
      );

      await expectThrowError(
        () =>
          program.program.methods
            .withdrawFromUserStorage(amount)
            .accounts({
              sender: nobody.publicKey,
              user: userAccount,
              senderTokenAccount: senderTokenAccount.address,
              userTokenAccount: userTokenAccount.address,
            })
            .signers([nobody])
            .rpc(),
        /AnchorError caused by account: user. Error Code: ConstraintSeeds/,
      );
    });

    it("fail - invalid sender token account mint", async () => {
      const [userAccount] = program.findUserAddress(user.publicKey);

      const userTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        userAccount,
        true,
      );

      const newTestMint = new TestToken(provider);
      await newTestMint.mint(1);

      const senderTokenAccount = await createAssociatedTokenAccount(
        provider.connection,
        user,
        newTestMint.token,
        user.publicKey,
      );

      await expectThrowError(
        () =>
          program.program.methods
            .withdrawFromUserStorage(amount)
            .accounts({
              sender: user.publicKey,
              user: userAccount,
              senderTokenAccount,
              userTokenAccount: userTokenAccount.address,
            })
            .signers([user])
            .rpc(),
        programError("InvalidToken"),
      );
    });

    it("fail - invalid sender token account owner", async () => {
      const [userAccount] = program.findUserAddress(user.publicKey);

      const userTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        userAccount,
        true,
      );

      const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        nobody,
        testMint.token,
        nobody.publicKey,
      );

      await expectThrowError(
        () =>
          program.program.methods
            .withdrawFromUserStorage(amount)
            .accounts({
              sender: user.publicKey,
              user: userAccount,
              senderTokenAccount: senderTokenAccount.address,
              userTokenAccount: userTokenAccount.address,
              tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([user])
            .rpc(),
        programError("IllegalOwner"),
      );
    });

    it("fail - invalid user token account mint", async () => {
      const [userAccount] = program.findUserAddress(user.publicKey);

      const newTestMint = new TestToken(provider);
      await newTestMint.mint(1);

      const userTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        newTestMint.token,
        userAccount,
        true,
      );

      const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        user.publicKey,
      );

      await expectThrowError(
        () =>
          program.program.methods
            .withdrawFromUserStorage(amount)
            .accounts({
              sender: user.publicKey,
              user: userAccount,
              senderTokenAccount: senderTokenAccount.address,
              userTokenAccount: userTokenAccount.address,
              tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([user])
            .rpc(),
        programError("InvalidToken"),
      );
    });

    it("fail - invalid token balance", async () => {
      const [userAccount] = program.findUserAddress(user.publicKey);

      const newTestMint = new TestToken(provider);
      await newTestMint.mint(1);

      const userTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        newTestMint.token,
        userAccount,
        true,
      );

      const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        newTestMint.token,
        user.publicKey,
      );

      await expectThrowError(
        () =>
          program.program.methods
            .withdrawFromUserStorage(amount)
            .accounts({
              sender: user.publicKey,
              user: userAccount,
              senderTokenAccount: senderTokenAccount.address,
              userTokenAccount: userTokenAccount.address,
              tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([user])
            .rpc(),
        /Error processing Instruction 0: custom program error: 0x1/,
      );
    });

    it("success", async () => {
      const [userAccount] = program.findUserAddress(user.publicKey);

      const userTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        userAccount,
        true,
      );

      const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        testMint.token,
        user.publicKey,
      );

      const senderBalanceBefore = await testMint.getBalance(user.publicKey);
      const userBalanceBefore = await testMint.getBalance(userAccount, true);

      await program.program.methods
        .withdrawFromUserStorage(amount)
        .accounts({
          sender: user.publicKey,
          user: userAccount,
          senderTokenAccount: senderTokenAccount.address,
          userTokenAccount: userTokenAccount.address,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([user])
        .rpc();

      const senderBalanceAfter = await testMint.getBalance(user.publicKey);
      const userBalanceAfter = await testMint.getBalance(userAccount, true);

      expect(
        senderBalanceAfter.eq(senderBalanceBefore.add(amount)),
      ).toBeTruthy();
      expect(userBalanceAfter.eq(userBalanceBefore.sub(amount))).toBeTruthy();
    });
  });
});
