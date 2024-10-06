use {
    anchor_lang::prelude::*,
    anchor_spl::token,
    ethnum::U256,
    std::ops::{Div, Mul},
};

pub const UUID_VERSION: usize = 4;
pub const DEFAULT_SUBSCRIPTION_PERIOD: i64 = 2_629_743;
pub const FULL_CAPACITY: u64 = 10_000;

/// This method transfers tokens from user token account to program
pub fn transfer_tokens<'info>(
    from: AccountInfo<'info>,
    to: AccountInfo<'info>,
    authority: AccountInfo<'info>,
    token_program: AccountInfo<'info>,
    amount: u64,
) -> Result<()> {
    let cpi_ctx = CpiContext::new(
        token_program,
        token::Transfer {
            from,
            to,
            authority,
        },
    );

    token::transfer(cpi_ctx, amount)
}

/// This method transfers tokens from program to user token account
pub fn transfer_pda_tokens<'info>(
    signer_seeds: &[Vec<u8>],
    signer_info: &AccountInfo<'info>,
    from: &AccountInfo<'info>,
    to: &AccountInfo<'info>,
    token_program: &AccountInfo<'info>,
    amount: u64,
) -> Result<()> {
    if amount == 0 {
        return Ok(());
    }

    let signer_seeds: Vec<&[u8]> = signer_seeds.iter().map(|s| s.as_slice()).collect();
    let seeds = &[signer_seeds.as_slice()];

    let cpi_ctx = CpiContext::new_with_signer(
        token_program.clone(),
        token::Transfer {
            from: from.clone(),
            to: to.clone(),
            authority: signer_info.clone(),
        },
        seeds,
    );

    token::transfer(cpi_ctx, amount)
}

/// This method calculates the amount of tokens that service will pay for the commission
pub fn calculate_commission_amount(amount: u64, commission: u64) -> u64 {
    U256::from(amount)
        .mul(U256::from(commission))
        .div(U256::from(FULL_CAPACITY))
        .as_u64()
}
