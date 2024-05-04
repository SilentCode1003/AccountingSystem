ALTER TABLE `accounts` MODIFY COLUMN `acc_created_at` datetime NOT NULL DEFAULT '2024-05-03 03:27:37.948';--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-05-03 03:27:37.948';--> statement-breakpoint
ALTER TABLE `api_key_store` MODIFY COLUMN `aks_id` varchar(60) NOT NULL;--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-05-03 03:27:37.959';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-05-03 03:27:37.959';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-05-03 03:27:37.984';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-05-03 03:27:37.984';