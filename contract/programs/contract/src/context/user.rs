use {
    anchor_lang::prelude::*,
    anchor_spl::token::{Token, TokenAccount},
};

use super::utils::{transfer_pda_tokens, transfer_tokens};
use crate::{error::ProgramError, id, state::user::User};

// --------------------------- Context ----------------------------- //

#[derive(Accounts)]
#[instruction(
    bump: u8,
)]
pub struct ReplenishUserStorage<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(
        init_if_needed,
        payer = sender,
        owner = id(),
        seeds = [b"user".as_ref(), sender.key.as_ref()],
        bump,
        space = User::LEN
    )]
    pub user: Account<'info, User>,

    #[account(
        mut,
        constraint = sender_token_account.owner == sender.key() @ ProgramError::IllegalOwner
    )]
    pub sender_token_account: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        constraint = user_token_account.owner == user.key() @ ProgramError::IllegalOwner
    )]
    pub user_token_account: Box<Account<'info, TokenAccount>>,

    #[account(address = Token::id())]
    pub token_program: Program<'info, Token>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawFromUserStorage<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(
        mut,
        seeds = [b"user".as_ref(), sender.key.as_ref()],
        constraint = user.address == sender.key() @ ProgramError::AuthorityMismatch,
        bump = user.bump,
    )]
    pub user: Account<'info, User>,

    #[account(
        mut,
        constraint = sender_token_account.owner == sender.key() @ ProgramError::IllegalOwner
    )]
    pub sender_token_account: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        constraint = user_token_account.owner == user.key() @ ProgramError::IllegalOwner
    )]
    pub user_token_account: Box<Account<'info, TokenAccount>>,

    #[account(address = Token::id())]
    pub token_program: Program<'info, Token>,
}

// ------------------------ Implementation ------------------------- //

impl<'info> ReplenishUserStorage<'info> {
    pub fn replenish_storage(&mut self, amount: u64, bump: u8) -> Result<()> {
        let user = &mut self.user;

        if user.bump == 0 {
            user.address = self.sender.key();
            user.bump = bump;
            user.version = User::VERSION;
        }

        transfer_tokens(
            self.sender_token_account.to_account_info(),
            self.user_token_account.to_account_info(),
            self.sender.to_account_info(),
            self.token_program.to_account_info(),
            amount,
        )?;

        msg!(
            "{} tokens transferred to user storage, mint {}",
            amount,
            self.user_token_account.mint
        );

        Ok(())
    }
}

impl<'info> WithdrawFromUserStorage<'info> {
    pub fn withdraw_from_storage(&mut self, amount: u64) -> Result<()> {
        let user = &mut self.user;

        transfer_pda_tokens(
            user.get_seeds(),
            user.to_account_info(),
            &self.user_token_account.to_account_info(),
            &self.sender_token_account.to_account_info(),
            self.token_program.to_account_info(),
            amount,
        )?;

        msg!(
            "{} tokens withdrawn from user storage, mint {}",
            amount,
            self.user_token_account.mint
        );

        Ok(())
    }
}
