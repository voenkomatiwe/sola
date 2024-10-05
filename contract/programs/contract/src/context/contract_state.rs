use anchor_lang::prelude::*;

use crate::{error::ProgramError, id, program::SubService, state::contract_state::State};

// --------------------------- Context ----------------------------- //

#[derive(Accounts)]
#[instruction(
    bump: u8,
)]
pub struct InitializeContractState<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        owner = id(),
        seeds = [b"state".as_ref()],
        bump,
        space = State::LEN
    )]
    pub state: Account<'info, State>,

    #[account(
        constraint = program_account.key() == id() @ ProgramError::InvalidProgramAccount,
        constraint = program_account.programdata_address()? == Some(program_data.key()) @ ProgramError::InvalidProgramData,
    )]
    pub program_account: Program<'info, SubService>,

    #[account(
        constraint = program_data.upgrade_authority_address == Some(authority.key()) @ ProgramError::AuthorityMismatch,
    )]
    pub program_data: Account<'info, ProgramData>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateContractState<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"state".as_ref()],
        constraint = state.authority == authority.key() @ ProgramError::AuthorityMismatch,
        bump = state.bump,
    )]
    pub state: Account<'info, State>,
}

// ------------------------ Implementation ------------------------- //

impl<'info> InitializeContractState<'info> {
    pub fn initialize_contract_state(
        &mut self,
        authority: Pubkey,
        withdraw_delegate: Pubkey,
        commission_owner: Pubkey,
        commission: u64,
        bump: u8,
    ) -> Result<()> {
        let state = &mut self.state;

        state.bump = bump;
        state.authority = authority;
        state.withdraw_delegate = withdraw_delegate;
        state.commission_owner = commission_owner;
        state.commission = commission;
        state.version = State::VERSION;

        msg!("Contract state initialized");

        Ok(())
    }
}

impl<'info> UpdateContractState<'info> {
    pub fn set_authority(&mut self, authority: Pubkey) -> Result<()> {
        let state = &mut self.state;

        state.authority = authority;
        state.updated_at = Clock::get()?.unix_timestamp;

        msg!("Contract state updated: authority set to {authority}",);

        Ok(())
    }

    pub fn set_withdraw_delegate(&mut self, withdraw_delegate: Pubkey) -> Result<()> {
        let state = &mut self.state;

        state.withdraw_delegate = withdraw_delegate;
        state.updated_at = Clock::get()?.unix_timestamp;

        msg!("Contract state updated: withdraw delegate set to {withdraw_delegate}",);

        Ok(())
    }

    pub fn set_commission_owner(&mut self, commission_owner: Pubkey) -> Result<()> {
        let state = &mut self.state;

        state.commission_owner = commission_owner;
        state.updated_at = Clock::get()?.unix_timestamp;

        msg!("Contract state updated: commission owner set to {commission_owner}",);

        Ok(())
    }

    pub fn set_commission(&mut self, commission: u64) -> Result<()> {
        let state = &mut self.state;

        state.commission = commission;
        state.updated_at = Clock::get()?.unix_timestamp;

        msg!("Contract state updated: chain ID set to {commission}",);

        Ok(())
    }
}
