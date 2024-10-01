use anchor_lang::prelude::*;

mod context;
mod error;
mod state;

declare_id!("ADU233uT8HgNtRrmn4twcHK6jbN8JpBA7oHuAeewVe8Z");

#[program]
pub mod sub_service {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
