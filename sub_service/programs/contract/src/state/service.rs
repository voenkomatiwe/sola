use super::{ACCOUNT_RESERVE_SPACE, DISCRIMINATOR_LENGTH};
use anchor_lang::prelude::*;

#[account]
pub struct Service {
    /// Account version
    pub version: u16,

    /// Seed bump for PDA
    pub bump: u8,

    /// Service UUID
    pub id: u128,

    /// Service authority
    pub authority: Pubkey,

    /// Subscription mint
    pub sub_mint: Pubkey,

    /// Subscription price
    pub sub_price: Pubkey,

    /// Amount of subscription
    pub subscribers_count: u64,

    /// Timestamp when the state was last updated
    pub updated_at: i64,
}

impl Service {
    pub const LEN: usize =
        DISCRIMINATOR_LENGTH + ACCOUNT_RESERVE_SPACE + (2 + 1 + 16 + 32 + 32 + 32 + 8 + 8);
    pub const VERSION: u16 = 1;
}
