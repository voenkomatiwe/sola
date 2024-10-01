use {crate::state::user::User, anchor_lang::prelude::*, anchor_spl::token};

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
pub fn withdraw_tokens<'info>(
    user: &Account<'info, User>,
    from: &AccountInfo<'info>,
    to: &AccountInfo<'info>,
    token_program: AccountInfo<'info>,
    amount: u64,
) -> Result<()> {
    if amount == 0 {
        return Ok(());
    }

    let signer_seeds = user.get_seeds();
    let signer_seeds: Vec<&[u8]> = signer_seeds.iter().map(|s| s.as_slice()).collect();
    let seeds = &[signer_seeds.as_slice()];

    let cpi_ctx = CpiContext::new_with_signer(
        token_program,
        token::Transfer {
            from: from.clone(),
            to: to.clone(),
            authority: user.to_account_info(),
        },
        seeds,
    );

    token::transfer(cpi_ctx, amount)
}
