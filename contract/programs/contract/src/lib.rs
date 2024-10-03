use anchor_lang::prelude::*;
use context::*;

mod context;
mod error;
mod state;

declare_id!("ADU233uT8HgNtRrmn4twcHK6jbN8JpBA7oHuAeewVe8Z");

#[program]
pub mod sub_service {
    use super::*;

    pub fn replenish_user_storage(
        ctx: Context<ReplenishUserStorage>,
        amount: u64,
        bump: u8,
    ) -> Result<()> {
        ctx.accounts.replenish_storage(amount, bump)
    }

    pub fn withdraw_from_user_storage(
        ctx: Context<WithdrawFromUserStorage>,
        amount: u64,
    ) -> Result<()> {
        ctx.accounts.withdraw_from_storage(amount)
    }

    pub fn create_service(
        ctx: Context<CreateService>,
        service_id: u128,
        authority: Pubkey,
        payment_delegate: Pubkey,
        sub_price: u64,
        bump: u8,
    ) -> Result<()> {
        ctx.accounts
            .create_service(service_id, authority, payment_delegate, sub_price, bump)
    }

    pub fn remove_service(ctx: Context<RemoveService>) -> Result<()> {
        ctx.accounts.remove_service()
    }

    pub fn update_service_authority(ctx: Context<UpdateService>, authority: Pubkey) -> Result<()> {
        ctx.accounts.update_authority(authority)
    }

    pub fn update_service_payment_delegate(
        ctx: Context<UpdateService>,
        payment_delegate: Pubkey,
    ) -> Result<()> {
        ctx.accounts.update_payment_delegate(payment_delegate)
    }

    pub fn update_service_mint(ctx: Context<UpdateService>, mint: Pubkey) -> Result<()> {
        ctx.accounts.update_mint(mint)
    }

    pub fn update_service_price(ctx: Context<UpdateService>, price: u64) -> Result<()> {
        ctx.accounts.update_price(price)
    }

    pub fn withdraw_from_service_storage(
        ctx: Context<WithdrawFromServiceStorage>,
        amount: u64,
    ) -> Result<()> {
        ctx.accounts.withdraw_from_storage(amount)
    }

    pub fn activate_subscription(ctx: Context<ActivateSubscription>, bump: u8) -> Result<()> {
        ctx.accounts.activate_subscription(bump)
    }

    pub fn deactivate_subscription(ctx: Context<DeactivateSubscription>) -> Result<()> {
        ctx.accounts.deactivate_subscription()
    }

    pub fn charge_subscription_payment(ctx: Context<ChargeSubscriptionPayment>) -> Result<()> {
        ctx.accounts.charge_subscription_payment()
    }
}
