use super::{ACCOUNT_RESERVE_SPACE, DISCRIMINATOR_LENGTH};
use anchor_lang::prelude::*;

#[account]
pub struct User {
    /// Account version
    pub version: u16,

    /// Seed bump for PDA
    pub bump: u8,

    /// User wallet address
    pub address: Pubkey,
}

impl User {
    pub const LEN: usize = DISCRIMINATOR_LENGTH + ACCOUNT_RESERVE_SPACE + (2 + 1 + 32);
    pub const VERSION: u16 = 1;

    pub fn get_seeds(&self) -> Vec<Vec<u8>> {
        vec![
            b"user".to_vec(),
            self.address.as_ref().to_vec(),
            [self.bump].to_vec(),
        ]
    }
}
