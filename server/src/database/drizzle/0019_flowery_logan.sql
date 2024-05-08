ALTER TABLE `accounts` MODIFY COLUMN `acc_created_at` datetime NOT NULL DEFAULT '2024-05-06 03:19:29.985';--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-05-06 03:19:29.985';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-05-06 03:19:29.995';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-05-06 03:19:29.995';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-05-06 03:19:30.023';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-05-06 03:19:30.023';--> statement-breakpoint
ALTER TABLE `inventory_entries` ADD `inv_entry_total_price` decimal(13,2);--> statement-breakpoint
ALTER TABLE `inventory_entries` ADD `inv_entry_quantity` int NOT NULL;--> statement-breakpoint
ALTER TABLE `inventory_entries` DROP COLUMN `inv_status`;