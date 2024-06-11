ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-06-11 01:51:54.650';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-06-11 01:51:54.660';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-06-11 01:51:54.660';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-06-11 01:51:54.649';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-06-11 01:51:54.649';--> statement-breakpoint
ALTER TABLE `running_balance` ADD `rb_created_at` datetime DEFAULT '2024-06-11 01:51:54.695' NOT NULL;--> statement-breakpoint
ALTER TABLE `running_balance` DROP COLUMN `id`;