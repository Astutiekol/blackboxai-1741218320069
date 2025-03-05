use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod my_smart_contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let record_account = &mut ctx.accounts.record_account;
        record_account.count = 0;
        Ok(())
    }

    pub fn create_record(ctx: Context<CreateRecord>, data: String) -> Result<()> {
        let record_account = &mut ctx.accounts.record_account;
        let author = &ctx.accounts.author;

        // Create a new record
        let record = Record {
            author: *author.key,
            data,
            timestamp: Clock::get()?.unix_timestamp,
        };

        record_account.records.push(record);
        record_account.count += 1;

        Ok(())
    }

    pub fn update_record(ctx: Context<UpdateRecord>, index: u64, new_data: String) -> Result<()> {
        let record_account = &mut ctx.accounts.record_account;
        let author = &ctx.accounts.author;

        require!(
            index < record_account.count,
            CustomError::InvalidRecordIndex
        );

        let record = &mut record_account.records[index as usize];
        require!(
            record.author == *author.key,
            CustomError::UnauthorizedAccess
        );

        record.data = new_data;
        record.timestamp = Clock::get()?.unix_timestamp;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 8 + (32 + 200 + 8) * 1000 // Allow for 1000 records
    )]
    pub record_account: Account<'info, RecordAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateRecord<'info> {
    #[account(mut)]
    pub record_account: Account<'info, RecordAccount>,
    pub author: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateRecord<'info> {
    #[account(mut)]
    pub record_account: Account<'info, RecordAccount>,
    pub author: Signer<'info>,
}

#[account]
pub struct RecordAccount {
    pub count: u64,
    pub records: Vec<Record>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Record {
    pub author: Pubkey,
    pub data: String,
    pub timestamp: i64,
}

#[error_code]
pub enum CustomError {
    #[msg("Invalid record index")]
    InvalidRecordIndex,
    #[msg("Unauthorized access")]
    UnauthorizedAccess,
}
