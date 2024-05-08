ALTER TABLE `accounts` MODIFY COLUMN `acc_created_at` datetime NOT NULL DEFAULT '2024-05-06 05:55:24.201';--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-05-06 05:55:24.201';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-05-06 05:55:24.211';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-05-06 05:55:24.211';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-05-06 05:55:24.242';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-05-06 05:55:24.242';--> statement-breakpoint
ALTER TABLE `inventory_entries` ADD `inv_entry_type` enum('INCOMING','OUTGOING') NOT NULL;