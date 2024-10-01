use anchor_lang::prelude::*;

#[error_code]
pub enum ProgramError {
    #[msg("Authority mismatched")]
    AuthorityMismatch,
    #[msg("Account has illegal owner")]
    IllegalOwner,
    #[msg("Invalid token account")]
    InvalidToken,
    #[msg("Invalid UUID")]
    InvalidUUID,
    #[msg("Service can be removed only if it has no subscriptions")]
    PresentSubscriptions,
    #[msg("Value overflow occurred")]
    ValueOverflow,
    #[msg("Untimely subscription payment")]
    UntimelyPayment,
}
