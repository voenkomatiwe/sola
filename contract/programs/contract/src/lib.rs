use anchor_lang::prelude::*;
use context::*;

mod context;
mod error;
mod state;

declare_id!("AbTt5oYWeBDh6qkYN4YPgEkL3gom81CXMW73tDctr85K");

#[program]
pub mod sub_service {
    use super::*;

    pub fn initialize_contract_state(
        ctx: Context<InitializeContractState>,
        authority: Pubkey,
        payment_delegate: Pubkey,
        commission_owner: Pubkey,
        commission: u64,
        bump: u8,
    ) -> Result<()> {
        ctx.accounts.initialize_contract_state(
            authority,
            payment_delegate,
            commission_owner,
            commission,
            bump,
        )
    }

    pub fn set_state_authority(ctx: Context<UpdateContractState>, authority: Pubkey) -> Result<()> {
        ctx.accounts.set_authority(authority)
    }

    pub fn set_state_payment_delegate(
        ctx: Context<UpdateContractState>,
        payment_delegate: Pubkey,
    ) -> Result<()> {
        ctx.accounts.set_payment_delegate(payment_delegate)
    }

    pub fn set_state_commission_owner(
        ctx: Context<UpdateContractState>,
        commission_owner: Pubkey,
    ) -> Result<()> {
        ctx.accounts.set_commission_owner(commission_owner)
    }

    pub fn set_state_commission(ctx: Context<UpdateContractState>, commission: u64) -> Result<()> {
        ctx.accounts.set_commission(commission)
    }

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
        subscription_period: Option<i64>,
        sub_price: u64,
        bump: u8,
    ) -> Result<()> {
        ctx.accounts
            .create_service(service_id, authority, subscription_period, sub_price, bump)
    }

    pub fn remove_service(ctx: Context<RemoveService>) -> Result<()> {
        ctx.accounts.remove_service()
    }

    pub fn update_service_authority(ctx: Context<UpdateService>, authority: Pubkey) -> Result<()> {
        ctx.accounts.update_authority(authority)
    }

    pub fn update_service_subscription_period(
        ctx: Context<UpdateService>,
        subscription_period: i64,
    ) -> Result<()> {
        ctx.accounts.update_subscription_period(subscription_period)
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
