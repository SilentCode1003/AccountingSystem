ALTER TABLE `cheques` RENAME COLUMN `chq_account_id` TO `chq_transaction_id`;--> statement-breakpoint
ALTER TABLE `cheques` DROP FOREIGN KEY `cheques_chq_account_id_accounts_acc_id_fk`;
--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_created_at` datetime NOT NULL DEFAULT '2024-05-06 08:15:51.168';--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-05-06 08:15:51.168';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-05-06 08:15:51.197';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-05-06 08:15:51.197';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-05-06 08:15:51.196';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-05-06 08:15:51.196';--> statement-breakpoint
ALTER TABLE `cheques` ADD CONSTRAINT `cheques_chq_transaction_id_transactions_tran_id_fk` FOREIGN KEY (`chq_transaction_id`) REFERENCES `transactions`(`tran_id`) ON DELETE cascade ON UPDATE no action;