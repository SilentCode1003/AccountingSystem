CREATE TABLE `api_key_store` (
	`aks_id` int AUTO_INCREMENT NOT NULL,
	`aks_user` varchar(60),
	`aks_api_key` varchar(60) NOT NULL,
	CONSTRAINT `api_key_store_aks_id` PRIMARY KEY(`aks_id`),
	CONSTRAINT `api_key_store_aks_api_key_unique` UNIQUE(`aks_api_key`)
);
--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_created_at` datetime NOT NULL DEFAULT '2024-05-03 02:35:36.045';--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-05-03 02:35:36.045';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-05-03 02:35:36.054';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-05-03 02:35:36.054';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-05-03 02:35:36.079';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-05-03 02:35:36.079';