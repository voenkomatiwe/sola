use {
    anchor_lang::prelude::*,
    anchor_spl::token::{Token, TokenAccount},
};

use super::utils::transfer_pda_tokens;
use crate::{
    error::ProgramError,
    id,
    state::{contract_state::State, service::Service, subscription::Subscription, user::User},
};

// --------------------------- Context ----------------------------- //

#[derive(Accounts)]
#[instruction(
    bump: u8,
)]
pub struct ActivateSubscription<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(
        init_if_needed,
        payer = sender,
        owner = id(),
        seeds = [b"subscription".as_ref(), user.address.as_ref(), &service.id.to_be_bytes()],
        bump,
        space = Subscription::LEN
    )]
    pub subscription: Account<'info, Subscription>,

    #[account(
        mut,
        seeds = [b"user".as_ref(), sender.key.as_ref()],
        constraint = user.address == sender.key() @ ProgramError::AuthorityMismatch,
        bump = user.bump,
    )]
    pub user: Account<'info, User>,

    #[account(
        mut,
        seeds = [b"service".as_ref(), &service.id.to_be_bytes()],
        bump = service.bump,
    )]
    pub service: Account<'info, Service>,

    #[account(
        mut,
        constraint = user_token_account.owner == user.key() @ ProgramError::IllegalOwner,
        constraint = user_token_account.mint == service.mint @ ProgramError::InvalidToken

    )]
    pub user_token_account: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        constraint = service_token_account.owner == service.key() @ ProgramError::IllegalOwner,
        constraint = service_token_account.mint == service.mint @ ProgramError::InvalidToken

    )]
    pub service_token_account: Box<Account<'info, TokenAccount>>,

    #[account(address = Token::id())]
    pub token_program: Program<'info, Token>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DeactivateSubscription<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(
        mut,
        seeds = [b"subscription".as_ref(), sender.key().as_ref(), &service.id.to_be_bytes()],
        bump = subscription.bump,
        constraint = subscription.user == sender.key() @ ProgramError::AuthorityMismatch,
    )]
    pub subscription: Account<'info, Subscription>,

    #[account(
        mut,
        seeds = [b"service".as_ref(), &service.id.to_be_bytes()],
        bump = service.bump,
    )]
    pub service: Account<'info, Service>,
}

#[derive(Accounts)]
pub struct ChargeSubscriptionPayment<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(
        mut,
        seeds = [b"subscription".as_ref(), sender.key.as_ref(), &service.id.to_be_bytes()],
        bump = subscription.bump,
    )]
    pub subscription: Account<'info, Subscription>,

    #[account(
        mut,
        seeds = [b"user".as_ref(), sender.key.as_ref()],
        bump = user.bump,
    )]
    pub user: Account<'info, User>,

    #[account(
        seeds = [b"service".as_ref(), &service.id.to_be_bytes()],
        bump = service.bump,
    )]
    pub service: Account<'info, Service>,

    #[account(
        mut,
        seeds = [b"state".as_ref()],
        constraint = state.payment_delegate == sender.key() @ ProgramError::AuthorityMismatch,
        bump = state.bump,
    )]
    pub state: Account<'info, State>,

    #[account(
        mut,
        constraint = user_token_account.owner == user.key() @ ProgramError::IllegalOwner,
        constraint = user_token_account.mint == service.mint @ ProgramError::InvalidToken

    )]
    pub user_token_account: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        constraint = service_token_account.owner == service.key() @ ProgramError::IllegalOwner,
        constraint = service_token_account.mint == service.mint @ ProgramError::InvalidToken

    )]
    pub service_token_account: Box<Account<'info, TokenAccount>>,

    #[account(address = Token::id())]
    pub token_program: Program<'info, Token>,
}

// ------------------------ Implementation ------------------------- //

impl<'info> ActivateSubscription<'info> {
    pub fn activate_subscription(&mut self, bump: u8) -> Result<()> {
        let subscription = &mut self.subscription;
        let service = &mut self.service;
        let user = &self.user;

        require!(
            !subscription.is_active,
            ProgramError::SubscriptionAlreadyActive
        );

        transfer_pda_tokens(
            &user.get_seeds(),
            &user.to_account_info(),
            &self.user_token_account.to_account_info(),
            &self.service_token_account.to_account_info(),
            &self.token_program.to_account_info(),
            service.sub_price,
        )?;

        if subscription.bump == 0 {
            subscription.bump = bump;
            subscription.service_id = service.id;
            subscription.user = self.sender.key();
            subscription.version = Subscription::VERSION;
        }

        subscription.last_payment = Clock::get()?.unix_timestamp;
        subscription.is_active = true;
        service.subscribers_count = service
            .subscribers_count
            .checked_add(1)
            .ok_or(ProgramError::ValueOverflow)?;

        msg!(
            "User subscription activated, user: {}, service id: {}",
            subscription.user,
            uuid::Uuid::from_u128(service.id),
        );

        Ok(())
    }
}

impl<'info> DeactivateSubscription<'info> {
    pub fn deactivate_subscription(&mut self) -> Result<()> {
        let subscription = &mut self.subscription;
        let service = &mut self.service;

        require!(subscription.is_active, ProgramError::SubscriptionInactive);

        subscription.is_active = false;
        service.subscribers_count = service
            .subscribers_count
            .checked_sub(1)
            .ok_or(ProgramError::ValueOverflow)?;

        msg!(
            "User subscription deactivated, user: {}, service id: {}",
            subscription.user,
            uuid::Uuid::from_u128(service.id),
        );

        Ok(())
    }
}

impl<'info> ChargeSubscriptionPayment<'info> {
    pub fn charge_subscription_payment(&mut self) -> Result<()> {
        let subscription = &mut self.subscription;
        let service = &mut self.service;
        let user = &self.user;
        let now = Clock::get()?.unix_timestamp;

        require!(subscription.is_active, ProgramError::SubscriptionInactive);
        require!(
            subscription.last_payment < now - service.subscription_period,
            ProgramError::UntimelyPayment
        );

        transfer_pda_tokens(
            &user.get_seeds(),
            &user.to_account_info(),
            &self.user_token_account.to_account_info(),
            &self.service_token_account.to_account_info(),
            &self.token_program.to_account_info(),
            service.sub_price,
        )?;

        subscription.last_payment = now;

        msg!(
            "User subscription payment charged, user: {}, service id: {}, amount: {}, mint: {}",
            subscription.user,
            uuid::Uuid::from_u128(service.id),
            service.sub_price,
            service.mint
        );

        Ok(())
    }
}
