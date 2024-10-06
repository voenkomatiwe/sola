use anchor_lang::prelude::*;

#[error_code]
pub enum ProgramError {
    #[msg("Authority mismatched")]
    AuthorityMismatch,
    #[msg("Invalid program data account")]
    InvalidProgramData,
    #[msg("Invalid program account")]
    InvalidProgramAccount,
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
    #[msg("Subscription already active")]
    SubscriptionAlreadyActive,
    #[msg("Subscription already inactive")]
    SubscriptionInactive,
    #[msg("Invalid fee amount")]
    InvalidFee,
}
