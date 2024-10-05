// import {
//   web3,
//   BN,
//   AnchorProvider,
//   workspace,
//   setProvider,
//   Program,
// } from "@coral-xyz/anchor";
// import {
//   TOKEN_PROGRAM_ID,
//   createAssociatedTokenAccount,
//   getOrCreateAssociatedTokenAccount,
// } from "@solana/spl-token";
// import { v4 as uuidv4 } from "uuid";

// import { expectThrowError } from "./util/console";
// import { programError } from "./util/error";
// import { TestToken } from "./util/token";
// import { airdrop, TEST_ID } from "./util/setup";

// import { ACCOUNT_SIZE, SubServiceProgram, uuidToBn } from "../lib";

// describe("Subscription", () => {
//   const provider = AnchorProvider.env();
//   setProvider(provider);

//   const program = new SubServiceProgram(
//     TEST_ID
//   );

//   const authority = web3.Keypair.generate();
//   const user = web3.Keypair.generate();
//   const nobody = web3.Keypair.generate();

//   const amount = new BN(100);
//   const id = uuidv4();

//   let testMint: TestToken;

//   beforeAll(async () => {
//     testMint = new TestToken(provider);
//     await testMint.mint(1_000_000_000);

//     await airdrop(provider.connection, authority.publicKey);
//     await airdrop(provider.connection, user.publicKey);
//     await airdrop(provider.connection, nobody.publicKey);

//     await testMint.transfer(null, user.publicKey, amount.muln(3).toNumber());
//     await program.replenishUserStorage(testMint.token, new BN(1), user);

//     await program.createService(
//       id,
//       authority.publicKey,
//       testMint.token,
//       amount
//     );
//   });

//   describe("activate_subscription", () => {
//     it("fail - authority mismatch", async () => {
//       const [userAccount] = program.findUserAddress(user.publicKey);
//       const [serviceAccount] = program.findServiceAddress(id);
//       const [subscriptionAccount, bump] = program.findSubscriptionAddress(
//         user.publicKey,
//         id
//       );

//       let userTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         userAccount,
//         true
//       );

//       let serviceTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         serviceAccount,
//         true
//       );

//       await expectThrowError(
//         () =>
//           program.program.methods
//             .activateSubscription(bump)
//             .accounts({
//               sender: nobody.publicKey,
//               subscription: subscriptionAccount,
//               user: userAccount,
//               service: serviceAccount,
//               userTokenAccount: userTokenAccount.address,
//               serviceTokenAccount: serviceTokenAccount.address,
//               tokenProgram: TOKEN_PROGRAM_ID,
//             })
//             .signers([nobody])
//             .rpc(),
//         /AnchorError caused by account: user. Error Code: ConstraintSeeds/
//       );
//     });

//     it("fail - invalid user token account mint", async () => {
//       const [userAccount] = program.findUserAddress(user.publicKey);
//       const [serviceAccount] = program.findServiceAddress(id);
//       const [subscriptionAccount, bump] = program.findSubscriptionAddress(
//         user.publicKey,
//         id
//       );

//       let newTestMint = new TestToken(provider);
//       await newTestMint.mint(1);

//       let userTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         newTestMint.token,
//         userAccount,
//         true
//       );

//       let serviceTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         serviceAccount,
//         true
//       );

//       await expectThrowError(
//         () =>
//           program.program.methods
//             .activateSubscription(bump)
//             .accounts({
//               sender: user.publicKey,
//               subscription: subscriptionAccount,
//               user: userAccount,
//               service: serviceAccount,
//               userTokenAccount: userTokenAccount.address,
//               serviceTokenAccount: serviceTokenAccount.address,
//               tokenProgram: TOKEN_PROGRAM_ID,
//             })
//             .signers([user])
//             .rpc(),
//         programError("InvalidToken")
//       );
//     });

//     it("fail - invalid service token account mint", async () => {
//       const [userAccount] = program.findUserAddress(user.publicKey);
//       const [serviceAccount] = program.findServiceAddress(id);
//       const [subscriptionAccount, bump] = program.findSubscriptionAddress(
//         user.publicKey,
//         id
//       );

//       let newTestMint = new TestToken(provider);
//       await newTestMint.mint(1);

//       let userTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         userAccount,
//         true
//       );

//       let serviceTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         newTestMint.token,
//         serviceAccount,
//         true
//       );

//       await expectThrowError(
//         () =>
//           program.program.methods
//             .activateSubscription(bump)
//             .accounts({
//               sender: user.publicKey,
//               subscription: subscriptionAccount,
//               user: userAccount,
//               service: serviceAccount,
//               userTokenAccount: userTokenAccount.address,
//               serviceTokenAccount: serviceTokenAccount.address,
//               tokenProgram: TOKEN_PROGRAM_ID,
//             })
//             .signers([user])
//             .rpc(),
//         programError("InvalidToken")
//       );
//     });

//     it("fail - invalid user token account owner", async () => {
//       const [userAccount] = program.findUserAddress(user.publicKey);
//       const [serviceAccount] = program.findServiceAddress(id);
//       const [subscriptionAccount, bump] = program.findSubscriptionAddress(
//         user.publicKey,
//         id
//       );

//       let userTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         nobody.publicKey
//       );

//       let serviceTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         serviceAccount,
//         true
//       );

//       await expectThrowError(
//         () =>
//           program.program.methods
//             .activateSubscription(bump)
//             .accounts({
//               sender: user.publicKey,
//               subscription: subscriptionAccount,
//               user: userAccount,
//               service: serviceAccount,
//               userTokenAccount: userTokenAccount.address,
//               serviceTokenAccount: serviceTokenAccount.address,
//               tokenProgram: TOKEN_PROGRAM_ID,
//             })
//             .signers([user])
//             .rpc(),
//         programError("IllegalOwner")
//       );
//     });

//     it("fail - invalid service token account owner", async () => {
//       const [userAccount] = program.findUserAddress(user.publicKey);
//       const [serviceAccount] = program.findServiceAddress(id);
//       const [subscriptionAccount, bump] = program.findSubscriptionAddress(
//         user.publicKey,
//         id
//       );

//       let userTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         userAccount,
//         true
//       );

//       let serviceTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         nobody.publicKey
//       );

//       await expectThrowError(
//         () =>
//           program.program.methods
//             .activateSubscription(bump)
//             .accounts({
//               sender: user.publicKey,
//               subscription: subscriptionAccount,
//               user: userAccount,
//               service: serviceAccount,
//               userTokenAccount: userTokenAccount.address,
//               serviceTokenAccount: serviceTokenAccount.address,
//               tokenProgram: TOKEN_PROGRAM_ID,
//             })
//             .signers([user])
//             .rpc(),
//         programError("IllegalOwner")
//       );
//     });

//     it("fail - invalid token balance", async () => {
//       const [userAccount] = program.findUserAddress(user.publicKey);
//       const [serviceAccount] = program.findServiceAddress(id);
//       const [subscriptionAccount, bump] = program.findSubscriptionAddress(
//         user.publicKey,
//         id
//       );

//       let userTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         userAccount,
//         true
//       );

//       let serviceTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         serviceAccount,
//         true
//       );

//       await expectThrowError(
//         () =>
//           program.program.methods
//             .activateSubscription(bump)
//             .accounts({
//               sender: user.publicKey,
//               subscription: subscriptionAccount,
//               user: userAccount,
//               service: serviceAccount,
//               userTokenAccount: userTokenAccount.address,
//               serviceTokenAccount: serviceTokenAccount.address,
//               tokenProgram: TOKEN_PROGRAM_ID,
//             })
//             .signers([user])
//             .rpc(),
//         /Error processing Instruction 0: custom program error: 0x1/
//       );

//       await program.replenishUserStorage(testMint.token, amount, user);
//     });

//     it("success", async () => {
//       const [userAccount] = program.findUserAddress(user.publicKey);
//       const [serviceAccount] = program.findServiceAddress(id);
//       const [subscriptionAccount, bump] = program.findSubscriptionAddress(
//         user.publicKey,
//         id
//       );

//       let userTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         userAccount,
//         true
//       );

//       let serviceTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         serviceAccount,
//         true
//       );

//       await program.replenishUserStorage(testMint.token, amount, user);

//       let serviceBalanceBefore = await testMint.getBalance(
//         serviceAccount,
//         true
//       );
//       let userBalanceBefore = await testMint.getBalance(userAccount, true);

//       await program.program.methods
//         .activateSubscription(bump)
//         .accounts({
//           sender: user.publicKey,
//           subscription: subscriptionAccount,
//           user: userAccount,
//           service: serviceAccount,
//           userTokenAccount: userTokenAccount.address,
//           serviceTokenAccount: serviceTokenAccount.address,
//           tokenProgram: TOKEN_PROGRAM_ID,
//         })
//         .signers([user])
//         .rpc();

//       const fetchedServiceAccount = await program.getServiceData(id);

//       expect(fetchedServiceAccount.subscribersCount.eq(new BN(1))).toBeTruthy();

//       const fetchedSubscriptionAccount = await program.getSubscriptionData(
//         user.publicKey,
//         id
//       );

//       expect(
//         (fetchedSubscriptionAccount.serviceId as BN).eq(uuidToBn(id))
//       ).toBeTruthy();
//       expect(fetchedSubscriptionAccount.user).toEqual(user.publicKey);
//       expect(fetchedSubscriptionAccount.lastPayment.isZero()).not.toBeTruthy();
//       expect(fetchedSubscriptionAccount.isActive).toBeTruthy();
//       expect(fetchedSubscriptionAccount.bump).toEqual(bump);

//       const subscriptionInfo =
//         await provider.connection.getAccountInfoAndContext(subscriptionAccount);

//       expect(subscriptionInfo.value.owner).toEqual(program.programId);
//       expect(subscriptionInfo.value.data.length).toEqual(
//         ACCOUNT_SIZE.subscription
//       );

//       let serviceBalanceAfter = await testMint.getBalance(serviceAccount, true);
//       let userBalanceAfter = await testMint.getBalance(userAccount, true);

//       expect(
//         serviceBalanceAfter.eq(serviceBalanceBefore.add(amount))
//       ).toBeTruthy();
//       expect(userBalanceAfter.eq(userBalanceBefore.sub(amount))).toBeTruthy();
//     });

//     it("fail - subscription is active", async () => {
//       const [userAccount] = program.findUserAddress(user.publicKey);
//       const [serviceAccount] = program.findServiceAddress(id);
//       const [subscriptionAccount, bump] = program.findSubscriptionAddress(
//         user.publicKey,
//         id
//       );

//       let userTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         userAccount,
//         true
//       );

//       let serviceTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         serviceAccount,
//         true
//       );

//       await expectThrowError(
//         () =>
//           program.program.methods
//             .activateSubscription(bump)
//             .accounts({
//               sender: user.publicKey,
//               subscription: subscriptionAccount,
//               user: userAccount,
//               service: serviceAccount,
//               userTokenAccount: userTokenAccount.address,
//               serviceTokenAccount: serviceTokenAccount.address,
//               tokenProgram: TOKEN_PROGRAM_ID,
//             })
//             .signers([user])
//             .rpc(),
//         programError("SubscriptionAlreadyActive")
//       );
//     });
//   });

//   describe("deactivate_subscription", () => {
//     it("fail - authority mismatch", async () => {
//       const [serviceAccount] = program.findServiceAddress(id);
//       const [subscriptionAccount] = program.findSubscriptionAddress(
//         user.publicKey,
//         id
//       );

//       await expectThrowError(
//         () =>
//           program.program.methods
//             .deactivateSubscription()
//             .accounts({
//               sender: nobody.publicKey,
//               subscription: subscriptionAccount,
//               service: serviceAccount,
//             })
//             .signers([nobody])
//             .rpc(),
//         /AnchorError caused by account: subscription. Error Code: ConstraintSeeds/
//       );
//     });

//     it("success", async () => {
//       const [serviceAccount] = program.findServiceAddress(id);
//       const [subscriptionAccount] = program.findSubscriptionAddress(
//         user.publicKey,
//         id
//       );

//       await program.program.methods
//         .deactivateSubscription()
//         .accounts({
//           sender: user.publicKey,
//           subscription: subscriptionAccount,
//           service: serviceAccount,
//         })
//         .signers([user])
//         .rpc();

//       const fetchedServiceAccount = await program.getServiceData(id);

//       expect(fetchedServiceAccount.subscribersCount.isZero()).toBeTruthy();

//       const fetchedSubscriptionAccount = await program.getSubscriptionData(
//         user.publicKey,
//         id
//       );

//       expect(fetchedSubscriptionAccount.isActive).not.toBeTruthy();
//     });

//     it("fail - subscription is inactive", async () => {
//       const [serviceAccount] = program.findServiceAddress(id);
//       const [subscriptionAccount, bump] = program.findSubscriptionAddress(
//         user.publicKey,
//         id
//       );

//       await expectThrowError(
//         () =>
//           program.program.methods
//             .deactivateSubscription()
//             .accounts({
//               sender: user.publicKey,
//               subscription: subscriptionAccount,
//               service: serviceAccount,
//             })
//             .signers([user])
//             .rpc(),
//         programError("SubscriptionInactive")
//       );
//     });
//   });

//   describe("charge_subscription_payment", () => {
//     it("fail - authority mismatch", async () => {
//       const [userAccount] = program.findUserAddress(user.publicKey);
//       const [serviceAccount] = program.findServiceAddress(id);
//       const [subscriptionAccount] = program.findSubscriptionAddress(
//         user.publicKey,
//         id
//       );

//       let userTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         userAccount,
//         true
//       );

//       let serviceTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         serviceAccount,
//         true
//       );

//       await expectThrowError(
//         () =>
//           program.program.methods
//             .chargeSubscriptionPayment()
//             .accounts({
//               sender: nobody.publicKey,
//               subscription: subscriptionAccount,
//               user: userAccount,
//               service: serviceAccount,
//               userTokenAccount: userTokenAccount.address,
//               serviceTokenAccount: serviceTokenAccount.address,
//               tokenProgram: TOKEN_PROGRAM_ID,
//             })
//             .signers([nobody])
//             .rpc(),
//         /AnchorError caused by account: subscription. Error Code: ConstraintSeeds/
//       );
//     });

//     it("fail - invalid user token account mint", async () => {
//       const [userAccount] = program.findUserAddress(user.publicKey);
//       const [serviceAccount] = program.findServiceAddress(id);
//       const [subscriptionAccount] = program.findSubscriptionAddress(
//         user.publicKey,
//         id
//       );

//       let newTestMint = new TestToken(provider);
//       await newTestMint.mint(1);

//       let userTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         newTestMint.token,
//         userAccount,
//         true
//       );

//       let serviceTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         serviceAccount,
//         true
//       );

//       await expectThrowError(
//         () =>
//           program.program.methods
//             .chargeSubscriptionPayment()
//             .accounts({
//               sender: user.publicKey,
//               subscription: subscriptionAccount,
//               user: userAccount,
//               service: serviceAccount,
//               userTokenAccount: userTokenAccount.address,
//               serviceTokenAccount: serviceTokenAccount.address,
//               tokenProgram: TOKEN_PROGRAM_ID,
//             })
//             .signers([user])
//             .rpc(),
//         programError("InvalidToken")
//       );
//     });

//     it("fail - invalid service token account mint", async () => {
//       const [userAccount] = program.findUserAddress(user.publicKey);
//       const [serviceAccount] = program.findServiceAddress(id);
//       const [subscriptionAccount] = program.findSubscriptionAddress(
//         user.publicKey,
//         id
//       );

//       let newTestMint = new TestToken(provider);
//       await newTestMint.mint(1);

//       let userTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         userAccount,
//         true
//       );

//       let serviceTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         newTestMint.token,
//         serviceAccount,
//         true
//       );

//       await expectThrowError(
//         () =>
//           program.program.methods
//             .chargeSubscriptionPayment()
//             .accounts({
//               sender: user.publicKey,
//               subscription: subscriptionAccount,
//               user: userAccount,
//               service: serviceAccount,
//               userTokenAccount: userTokenAccount.address,
//               serviceTokenAccount: serviceTokenAccount.address,
//               tokenProgram: TOKEN_PROGRAM_ID,
//             })
//             .signers([user])
//             .rpc(),
//         programError("InvalidToken")
//       );
//     });

//     it("fail - invalid user token account owner", async () => {
//       const [userAccount] = program.findUserAddress(user.publicKey);
//       const [serviceAccount] = program.findServiceAddress(id);
//       const [subscriptionAccount] = program.findSubscriptionAddress(
//         user.publicKey,
//         id
//       );

//       let userTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         nobody.publicKey
//       );

//       let serviceTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         serviceAccount,
//         true
//       );

//       await expectThrowError(
//         () =>
//           program.program.methods
//             .chargeSubscriptionPayment()
//             .accounts({
//               sender: user.publicKey,
//               subscription: subscriptionAccount,
//               user: userAccount,
//               service: serviceAccount,
//               userTokenAccount: userTokenAccount.address,
//               serviceTokenAccount: serviceTokenAccount.address,
//               tokenProgram: TOKEN_PROGRAM_ID,
//             })
//             .signers([user])
//             .rpc(),
//         programError("IllegalOwner")
//       );
//     });

//     it("fail - invalid service token account owner", async () => {
//       const [userAccount] = program.findUserAddress(user.publicKey);
//       const [serviceAccount] = program.findServiceAddress(id);
//       const [subscriptionAccount] = program.findSubscriptionAddress(
//         user.publicKey,
//         id
//       );

//       let userTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         userAccount,
//         true
//       );

//       let serviceTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         nobody.publicKey
//       );

//       await expectThrowError(
//         () =>
//           program.program.methods
//             .chargeSubscriptionPayment()
//             .accounts({
//               sender: user.publicKey,
//               subscription: subscriptionAccount,
//               user: userAccount,
//               service: serviceAccount,
//               userTokenAccount: userTokenAccount.address,
//               serviceTokenAccount: serviceTokenAccount.address,
//               tokenProgram: TOKEN_PROGRAM_ID,
//             })
//             .signers([user])
//             .rpc(),
//         programError("IllegalOwner")
//       );
//     });

//     it("fail - subscription is inactive", async () => {
//       const [userAccount] = program.findUserAddress(user.publicKey);
//       const [serviceAccount] = program.findServiceAddress(id);
//       const [subscriptionAccount] = program.findSubscriptionAddress(
//         user.publicKey,
//         id
//       );

//       let userTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         userAccount,
//         true
//       );

//       let serviceTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         serviceAccount,
//         true
//       );

//       await expectThrowError(
//         () =>
//           program.program.methods
//             .chargeSubscriptionPayment()
//             .accounts({
//               sender: user.publicKey,
//               subscription: subscriptionAccount,
//               user: userAccount,
//               service: serviceAccount,
//               userTokenAccount: userTokenAccount.address,
//               serviceTokenAccount: serviceTokenAccount.address,
//               tokenProgram: TOKEN_PROGRAM_ID,
//             })
//             .signers([user])
//             .rpc(),
//         programError("SubscriptionInactive")
//       );

//       await program.activateSubscription(id, user);
//     });

//     it("fail - invalid token balance", async () => {
//       const [userAccount] = program.findUserAddress(user.publicKey);
//       const [serviceAccount] = program.findServiceAddress(id);
//       const [subscriptionAccount] = program.findSubscriptionAddress(
//         user.publicKey,
//         id
//       );

//       let userTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         userAccount,
//         true
//       );

//       let serviceTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         serviceAccount,
//         true
//       );

//       await expectThrowError(
//         () =>
//           program.program.methods
//             .chargeSubscriptionPayment()
//             .accounts({
//               sender: user.publicKey,
//               subscription: subscriptionAccount,
//               user: userAccount,
//               service: serviceAccount,
//               userTokenAccount: userTokenAccount.address,
//               serviceTokenAccount: serviceTokenAccount.address,
//               tokenProgram: TOKEN_PROGRAM_ID,
//             })
//             .signers([user])
//             .rpc(),
//         /Error processing Instruction 0: custom program error: 0x1/
//       );
//     });

//     it("success", async () => {
//       const [userAccount] = program.findUserAddress(user.publicKey);
//       const [serviceAccount] = program.findServiceAddress(id);
//       const [subscriptionAccount] = program.findSubscriptionAddress(
//         user.publicKey,
//         id
//       );

//       let userTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         userAccount,
//         true
//       );

//       let serviceTokenAccount = await getOrCreateAssociatedTokenAccount(
//         provider.connection,
//         user,
//         testMint.token,
//         serviceAccount,
//         true
//       );

//       await program.replenishUserStorage(testMint.token, amount, user);

//       let serviceBalanceBefore = await testMint.getBalance(
//         serviceAccount,
//         true
//       );
//       let userBalanceBefore = await testMint.getBalance(userAccount, true);

//       await program.program.methods
//         .chargeSubscriptionPayment()
//         .accounts({
//           sender: user.publicKey,
//           subscription: subscriptionAccount,
//           user: userAccount,
//           service: serviceAccount,
//           userTokenAccount: userTokenAccount.address,
//           serviceTokenAccount: serviceTokenAccount.address,
//           tokenProgram: TOKEN_PROGRAM_ID,
//         })
//         .signers([user])
//         .rpc();

//       let serviceBalanceAfter = await testMint.getBalance(serviceAccount, true);
//       let userBalanceAfter = await testMint.getBalance(userAccount, true);

//       expect(
//         serviceBalanceAfter.eq(serviceBalanceBefore.add(amount))
//       ).toBeTruthy();
//       expect(userBalanceAfter.eq(userBalanceBefore.sub(amount))).toBeTruthy();
//     });
//   });
// });
