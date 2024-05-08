ALTER TABLE `payrolls` RENAME COLUMN `pr_account_id` TO `pr_transaction_id`;--> statement-breakpoint
ALTER TABLE `payrolls` DROP FOREIGN KEY `payrolls_pr_account_id_accounts_acc_id_fk`;
--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_created_at` datetime NOT NULL DEFAULT '2024-05-04 07:28:41.783';--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-05-04 07:28:41.783';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-05-04 07:28:41.792';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-05-04 07:28:41.792';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-05-04 07:28:41.821';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-05-04 07:28:41.821';--> statement-breakpoint
ALTER TABLE `payrolls` ADD CONSTRAINT `payrolls_pr_transaction_id_transactions_tran_id_fk` FOREIGN KEY (`pr_transaction_id`) REFERENCES `transactions`(`tran_id`) ON DELETE cascade ON UPDATE no action;