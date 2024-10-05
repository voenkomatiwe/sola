use super::{ACCOUNT_RESERVE_SPACE, DISCRIMINATOR_LENGTH};
use anchor_lang::prelude::*;

#[account]
pub struct State {
    /// Account version
    pub version: u8,

    /// Seed bump for PDA
    pub bump: u8,

    /// Contract authority
    pub authority: Pubkey,

    /// Public key of the delegate wallet that can be used for charging subscription payments
    pub withdraw_delegate: Pubkey,

    /// Public key of the commission wallet
    pub commission_owner: Pubkey,

    /// Sub service commission
    pub commission: u64,

    /// Timestamp when the state was last updated
    pub updated_at: i64,
}

impl State {
    pub const LEN: usize =
        DISCRIMINATOR_LENGTH + ACCOUNT_RESERVE_SPACE + (1 + 1 + 32 + 32 + 32 + 8);
    pub const VERSION: u8 = 1;
}
