import { IDL } from "./idl/sub_service";

// SubService Instructions
export const SubServiceInstructionVariants = IDL.instructions.map(
  (ix) => ix.name
);

export type SubServiceInstruction =
  (typeof SubServiceInstructionVariants)[number];

// SubService Accounts
export const SubServiceAccountVariants = IDL.accounts.map((acc) => acc.name);

export type SubServiceAccount = (typeof SubServiceAccountVariants)[number];

export const ACCOUNT_SIZE: Readonly<Record<SubServiceAccount, number>> = {
  service: 179,
  user: 75,
  subscription: 100,
};
