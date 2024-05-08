CREATE TABLE `tran_types` (
	`tran_type_id` varchar(60) NOT NULL,
	`tran_type_name` varchar(60) NOT NULL,
	CONSTRAINT `tran_types_tran_type_id` PRIMARY KEY(`tran_type_id`),
	CONSTRAINT `tran_types_tran_type_name_unique` UNIQUE(`tran_type_name`)
);
--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_created_at` datetime NOT NULL DEFAULT '2024-05-04 06:37:36.457';--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-05-04 06:37:36.457';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-05-04 06:37:36.466';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-05-04 06:37:36.466';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-05-04 06:37:36.500';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-05-04 06:37:36.500';--> statement-breakpoint
ALTER TABLE `transactions` ADD `tran_type_id` varchar(60);--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_tran_type_id_tran_types_tran_type_id_fk` FOREIGN KEY (`tran_type_id`) REFERENCES `tran_types`(`tran_type_id`) ON DELETE cascade ON UPDATE no action;