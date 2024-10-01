use {anchor_lang::prelude::*, anchor_spl::token};

pub const UUID_VERSION: usize = 4;

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
    signer_seeds: Vec<Vec<u8>>,
    authority: AccountInfo<'info>,
    from: &AccountInfo<'info>,
    to: &AccountInfo<'info>,
    token_program: AccountInfo<'info>,
    amount: u64,
) -> Result<()> {
    if amount == 0 {
        return Ok(());
    }

    let signer_seeds: Vec<&[u8]> = signer_seeds.iter().map(|s| s.as_slice()).collect();
    let seeds = &[signer_seeds.as_slice()];

    let cpi_ctx = CpiContext::new_with_signer(
        token_program,
        token::Transfer {
            from: from.clone(),
            to: to.clone(),
            authority,
        },
        seeds,
    );

    token::transfer(cpi_ctx, amount)
}
