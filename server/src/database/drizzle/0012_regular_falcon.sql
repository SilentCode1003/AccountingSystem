ALTER TABLE `api_key_store` RENAME COLUMN `aks_user` TO `aks_user_name`;--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_created_at` datetime NOT NULL DEFAULT '2024-05-03 02:39:13.174';--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-05-03 02:39:13.174';--> statement-breakpoint
ALTER TABLE `api_key_store` MODIFY COLUMN `aks_user_name` varchar(60) NOT NULL;--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-05-03 02:39:13.184';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-05-03 02:39:13.184';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-05-03 02:39:13.208';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-05-03 02:39:13.208';--> statement-breakpoint
ALTER TABLE `api_key_store` ADD CONSTRAINT `api_key_store_aks_user_name_unique` UNIQUE(`aks_user_name`);