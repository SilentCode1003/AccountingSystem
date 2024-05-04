ALTER TABLE `api_key_store` RENAME COLUMN `aks_api_key` TO `aks_hashed_key`;--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_created_at` datetime NOT NULL DEFAULT '2024-05-03 03:33:02.492';--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-05-03 03:33:02.492';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-05-03 03:33:02.501';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-05-03 03:33:02.501';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-05-03 03:33:02.526';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-05-03 03:33:02.526';--> statement-breakpoint
ALTER TABLE `api_key_store` ADD CONSTRAINT `api_key_store_aks_hashed_key_unique` UNIQUE(`aks_hashed_key`);--> statement-breakpoint
ALTER TABLE `api_key_store` DROP INDEX `api_key_store_aks_api_key_unique`;