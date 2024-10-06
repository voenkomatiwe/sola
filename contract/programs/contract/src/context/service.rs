use {
    anchor_lang::prelude::*,
    anchor_spl::token::{Mint, Token, TokenAccount},
};

use crate::{
    context::utils::{
        bytes_to_string, calculate_commission_amount, transfer_pda_tokens,
        DEFAULT_SUBSCRIPTION_PERIOD, UUID_VERSION,
    },
    error::ProgramError,
    id,
    state::{contract_state::State, service::Service},
};

// --------------------------- Context ----------------------------- //

#[derive(Accounts)]
#[instruction(
    service_id: u128,
    authority: Pubkey,
    sub_price: u64,
    bump: u8,
)]
pub struct CreateService<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(
        init,
        payer = sender,
        owner = id(),
        seeds = [b"service".as_ref(), &service_id.to_be_bytes()],
        bump,
        space = Service::LEN
    )]
    pub service: Account<'info, Service>,

    #[account(
        owner = Token::id()
    )]
    pub mint: Account<'info, Mint>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RemoveService<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(
        mut,
        close = sender,
        seeds = [b"service".as_ref(), &service.id.to_be_bytes()],
        constraint = service.authority == sender.key() @ ProgramError::AuthorityMismatch,
        bump = service.bump,
    )]
    pub service: Account<'info, Service>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateService<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(
        mut,
        seeds = [b"service".as_ref(), &service.id.to_be_bytes()],
        constraint = service.authority == sender.key() @ ProgramError::AuthorityMismatch,
        bump = service.bump,
    )]
    pub service: Account<'info, Service>,
}

#[derive(Accounts)]
pub struct WithdrawFromServiceStorage<'info> {
    pub sender: Signer<'info>,

    #[account(
        mut,
        seeds = [b"service".as_ref(), &service.id.to_be_bytes()],
        constraint = service.authority == sender.key() @ ProgramError::AuthorityMismatch,
        bump = service.bump,
    )]
    pub service: Account<'info, Service>,

    #[account(
        mut,
        seeds = [b"state".as_ref()],
        bump = state.bump,
    )]
    pub state: Account<'info, State>,

    #[account(
        mut,
        constraint = sender_token_account.owner == sender.key() @ ProgramError::IllegalOwner,
        constraint = sender_token_account.mint == service.mint @ ProgramError::InvalidToken
    )]
    pub sender_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = service_token_account.owner == service.key() @ ProgramError::IllegalOwner,
        constraint = service_token_account.mint == service.mint @ ProgramError::InvalidToken
    )]
    pub service_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = commission_owner_token_account.owner == state.commission_owner @ ProgramError::IllegalOwner,
        constraint = commission_owner_token_account.mint == service.mint @ ProgramError::InvalidToken
    )]
    pub commission_owner_token_account: Account<'info, TokenAccount>,

    #[account(address = Token::id())]
    pub token_program: Program<'info, Token>,
}

// ------------------------ Implementation ------------------------- //

impl<'info> CreateService<'info> {
    pub fn create_service(
        &mut self,
        service_id: u128,
        name: [u8; 32],
        url: [u8; 32],
        authority: Pubkey,
        subscription_period: Option<i64>,
        sub_price: u64,
        bump: u8,
    ) -> Result<()> {
        let service = &mut self.service;
        let id = uuid::Uuid::from_u128(service_id);

        require!(
            id.get_version_num() == UUID_VERSION,
            ProgramError::InvalidUUID
        );

        service.bump = bump;
        service.id = service_id;
        service.name = name;
        service.url = url;
        service.authority = authority;
        service.subscription_period = subscription_period.unwrap_or(DEFAULT_SUBSCRIPTION_PERIOD);
        service.mint = self.mint.key();
        service.sub_price = sub_price;
        service.updated_at = Clock::get()?.unix_timestamp;
        service.version = Service::VERSION;

        msg!("Service created, id: {id}",);

        Ok(())
    }
}

impl<'info> RemoveService<'info> {
    pub fn remove_service(&mut self) -> Result<()> {
        let service = &self.service;
        let id = uuid::Uuid::from_u128(service.id);

        require!(
            service.subscribers_count == 0,
            ProgramError::PresentSubscriptions
        );

        msg!("Service removed, id: {id}",);

        Ok(())
    }
}

impl<'info> UpdateService<'info> {
    pub fn update_authority(&mut self, authority: Pubkey) -> Result<()> {
        let service = &mut self.service;
        let id = uuid::Uuid::from_u128(service.id);

        service.authority = authority;
        service.updated_at = Clock::get()?.unix_timestamp;

        msg!("Service withdraw authority updated, id: {id}, authority: {authority}",);

        Ok(())
    }

    pub fn update_name(&mut self, name: [u8; 32]) -> Result<()> {
        let service = &mut self.service;
        let id = uuid::Uuid::from_u128(service.id);

        service.name = name;
        service.updated_at = Clock::get()?.unix_timestamp;

        msg!(
            "Service name updated, id: {id}, name: {}",
            bytes_to_string(&name)?
        );

        Ok(())
    }

    pub fn update_url(&mut self, url: [u8; 32]) -> Result<()> {
        let service = &mut self.service;
        let id = uuid::Uuid::from_u128(service.id);

        service.url = url;
        service.updated_at = Clock::get()?.unix_timestamp;

        msg!(
            "Service url updated, id: {id}, url: {}",
            bytes_to_string(&url)?
        );

        Ok(())
    }

    pub fn update_subscription_period(&mut self, subscription_period: i64) -> Result<()> {
        let service = &mut self.service;
        let id = uuid::Uuid::from_u128(service.id);

        service.subscription_period = subscription_period;
        service.updated_at = Clock::get()?.unix_timestamp;

        msg!("Service subscription period updated, id: {id}, period: {subscription_period}",);

        Ok(())
    }

    pub fn update_mint(&mut self, mint: Pubkey) -> Result<()> {
        let service = &mut self.service;
        let id = uuid::Uuid::from_u128(service.id);

        service.mint = mint;
        service.updated_at = Clock::get()?.unix_timestamp;

        msg!("Service mint updated, id: {id}, mint: {mint}",);

        Ok(())
    }

    pub fn update_price(&mut self, price: u64) -> Result<()> {
        let service = &mut self.service;
        let id = uuid::Uuid::from_u128(service.id);

        service.sub_price = price;
        service.updated_at = Clock::get()?.unix_timestamp;

        msg!("Service subscription price updated, id: {id}, price: {price}",);

        Ok(())
    }
}

impl<'info> WithdrawFromServiceStorage<'info> {
    pub fn withdraw_from_storage(&mut self, amount: u64) -> Result<()> {
        let service = &mut self.service;

        let commission_amount = calculate_commission_amount(amount, self.state.commission);

        transfer_pda_tokens(
            &service.get_seeds(),
            &service.to_account_info(),
            &self.service_token_account.to_account_info(),
            &self.commission_owner_token_account.to_account_info(),
            &self.token_program.to_account_info(),
            commission_amount,
        )?;

        transfer_pda_tokens(
            &service.get_seeds(),
            &service.to_account_info(),
            &self.service_token_account.to_account_info(),
            &self.sender_token_account.to_account_info(),
            &self.token_program.to_account_info(),
            amount - commission_amount,
        )?;

        msg!(
            "{} tokens withdrawn from service storage, mint {}",
            amount,
            service.mint
        );

        Ok(())
    }
}
