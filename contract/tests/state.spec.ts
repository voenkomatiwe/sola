import { web3, AnchorProvider, setProvider, BN } from "@coral-xyz/anchor";

import { expectThrowError } from "./util/console";
import { programError } from "./util/error";
import { TestToken } from "./util/token";
import { TEST_ID, airdrop } from "./util/setup";
import { ACCOUNT_SIZE, SubServiceProgram } from "../lib";

describe("State", () => {
  const provider = AnchorProvider.env();
  setProvider(provider);

  const program = new SubServiceProgram(TEST_ID);

  const commission = new BN(1000);
  const authority = web3.Keypair.generate();
  const another_authority = web3.Keypair.generate();
  const withdraw_delegate = web3.Keypair.generate();
  const commission_owner = web3.Keypair.generate();

  let testMint: TestToken;

  beforeAll(async () => {
    testMint = new TestToken(provider);
    await testMint.mint(1_000_000_000);

    await airdrop(provider.connection, authority.publicKey);
    await airdrop(provider.connection, another_authority.publicKey);
  });

  describe("initialize_state", () => {
    it("fail - authority mismatch", async () => {
      const [state, bump] = program.findContractStateAddress();
      const [programData] = program.findProgramDataAddress();

      await expectThrowError(
        () =>
          program.program.methods
            .initializeContractState(
              authority.publicKey,
              withdraw_delegate.publicKey,
              commission_owner.publicKey,
              commission,
              bump
            )
            .accounts({
              authority: another_authority.publicKey,
              state,
              programAccount: TEST_ID,
              programData,
              systemProgram: web3.SystemProgram.programId,
            })
            .signers([another_authority])
            .rpc(),
        programError("AuthorityMismatch")
      );
    });

    it("success", async () => {
      const [state, bump] = program.findContractStateAddress();
      const [programData] = program.findProgramDataAddress();

      await program.program.methods
        .initializeContractState(
          authority.publicKey,
          withdraw_delegate.publicKey,
          commission_owner.publicKey,
          commission,
          bump
        )
        .accounts({
          authority: provider.publicKey,
          state,
          programAccount: TEST_ID,
          programData,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      const fetchedStateAccount = await program.getContractStateData();

      expect(fetchedStateAccount.authority).toEqual(authority.publicKey);
      expect(fetchedStateAccount.withdrawDelegate).toEqual(
        withdraw_delegate.publicKey
      );
      expect(fetchedStateAccount.commissionOwner).toEqual(
        commission_owner.publicKey
      );
      expect(fetchedStateAccount.commission.eq(commission)).toBeTruthy();
      const stateInfo = await provider.connection.getAccountInfoAndContext(
        state
      );

      expect(stateInfo.value.owner).toEqual(program.programId);
      expect(stateInfo.value.data.length).toEqual(ACCOUNT_SIZE.state);
    });

    it("fail - state already exists", async () => {
      const [state, bump] = program.findContractStateAddress();
      const [programData] = program.findProgramDataAddress();

      await expectThrowError(
        () =>
          program.program.methods
            .initializeContractState(
              authority.publicKey,
              withdraw_delegate.publicKey,
              commission_owner.publicKey,
              commission,
              bump
            )
            .accounts({
              authority: provider.publicKey,
              state,
              programAccount: TEST_ID,
              programData,
              systemProgram: web3.SystemProgram.programId,
            })
            .rpc(),
        /custom program error: 0x0/
      );
    });
  });

  describe("update_state", () => {
    it("fail - authority mismatch", async () => {
      const [state] = program.findContractStateAddress();

      await expectThrowError(
        () =>
          program.program.methods
            .setStateWithdrawDelegate(another_authority.publicKey)
            .accounts({
              authority: another_authority.publicKey,
              state,
            })
            .signers([another_authority])
            .rpc(),
        programError("AuthorityMismatch")
      );
    });

    it("success - update withdraw delegate", async () => {
      const [state] = program.findContractStateAddress();

      await program.program.methods
        .setStateWithdrawDelegate(another_authority.publicKey)
        .accounts({
          authority: authority.publicKey,
          state,
        })
        .signers([authority])
        .rpc();

      const fetchedStateAccount = await program.getContractStateData();

      expect(fetchedStateAccount.withdrawDelegate).toEqual(
        another_authority.publicKey
      );
    });

    it("success - update commission owner", async () => {
      const [state] = program.findContractStateAddress();

      await program.program.methods
        .setStateCommissionOwner(another_authority.publicKey)
        .accounts({
          authority: authority.publicKey,
          state,
        })
        .signers([authority])
        .rpc();

      const fetchedStateAccount = await program.getContractStateData();

      expect(fetchedStateAccount.commissionOwner).toEqual(
        another_authority.publicKey
      );
    });

    it("success - update commission", async () => {
      const [state] = program.findContractStateAddress();
      const newCommission = new BN(123456);

      await program.program.methods
        .setStateCommission(newCommission)
        .accounts({
          authority: authority.publicKey,
          state,
        })
        .signers([authority])
        .rpc();

      const fetchedStateAccount = await program.getContractStateData();

      expect(fetchedStateAccount.commission.eq(newCommission)).toBeTruthy();
    });

    it("success - update authority", async () => {
      const [state] = program.findContractStateAddress();

      await program.program.methods
        .setStateAuthority(provider.publicKey)
        .accounts({
          authority: authority.publicKey,
          state,
        })
        .signers([authority])
        .rpc();

      const fetchedStateAccount = await program.getContractStateData();

      expect(fetchedStateAccount.authority).toEqual(provider.publicKey);
    });
  });
});
