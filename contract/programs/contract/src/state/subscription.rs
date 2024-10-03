use super::{ACCOUNT_RESERVE_SPACE, DISCRIMINATOR_LENGTH};
use anchor_lang::prelude::*;

#[account]
pub struct Subscription {
    /// Account version
    pub version: u16,

    /// Seed bump for PDA
    pub bump: u8,

    /// Service UUID
    pub service_id: u128,

    /// User wallet address
    pub user: Pubkey,

    /// User wallet PDA address
    pub is_active: bool,

    /// Whether the subscription is active
    pub last_payment: i64,
}

impl Subscription {
    pub const LEN: usize = DISCRIMINATOR_LENGTH + ACCOUNT_RESERVE_SPACE + (2 + 1 + 16 + 32 + 1 + 8);
    pub const VERSION: u16 = 1;
}
