use anchor_lang::prelude::*;

#[error_code]
pub enum ProgramError {
    #[msg("Authority mismatched")]
    AuthorityMismatch,
    #[msg("Account has illegal owner")]
    IllegalOwner,
    #[msg("Invalid token account")]
    InvalidToken,
}
