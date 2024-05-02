ALTER TABLE `accounts` MODIFY COLUMN `acc_created_at` datetime NOT NULL DEFAULT '2024-04-27 05:30:22.853';--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-04-27 05:30:22.853';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-04-27 05:30:22.860';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-04-27 05:30:22.860';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-04-27 05:30:22.887';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-04-27 05:30:22.887';--> statement-breakpoint
ALTER TABLE `cheques` ADD `chq_number` varchar(50) NOT NULL UNIQUE;--> statement-breakpoint
ALTER TABLE `cheques` ADD CONSTRAINT `cheques_chq_number_unique` UNIQUE(`chq_number`);--> statement-breakpoint
ALTER TABLE `cheques` ADD `chq_approval_count` int DEFAULT 0 NOT NULL;