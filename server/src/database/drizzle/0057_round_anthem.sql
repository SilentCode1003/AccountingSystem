ALTER TABLE `running_balance` RENAME COLUMN `rb_budget_id` TO `rb_budget`;--> statement-breakpoint
ALTER TABLE `running_balance` DROP FOREIGN KEY `running_balance_rb_budget_id_budget_budget_id_fk`;
--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_created_at` date NOT NULL DEFAULT '2024-06-11';--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-06-11 01:37:20.903';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-06-11 01:37:20.914';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-06-11 01:37:20.914';--> statement-breakpoint
ALTER TABLE `running_balance` MODIFY COLUMN `rb_budget` decimal(13,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-06-11 01:37:20.902';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-06-11 01:37:20.902';--> statement-breakpoint
ALTER TABLE `running_balance` ADD `id` int;