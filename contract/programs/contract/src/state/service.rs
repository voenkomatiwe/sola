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

    // TODO: maybe make separate authorities for charging and withdraw?
    /// Service withdraw authority
    pub authority: Pubkey,

    /// Subscription mint
    pub mint: Pubkey,

    /// Subscription price
    pub sub_price: u64,

    /// Amount of subscription
    pub subscribers_count: u64,

    /// Timestamp when the state was last updated
    pub updated_at: i64,
}

impl Service {
    pub const LEN: usize =
        DISCRIMINATOR_LENGTH + ACCOUNT_RESERVE_SPACE + (2 + 1 + 16 + 32 + 32 + 8 + 8 + 8);
    pub const VERSION: u16 = 1;

    pub fn get_seeds(&self) -> Vec<Vec<u8>> {
        vec![b"service".to_vec(), self.id.to_be_bytes().to_vec()]
    }
}
