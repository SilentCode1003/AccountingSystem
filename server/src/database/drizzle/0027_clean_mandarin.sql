ALTER TABLE `accounts` MODIFY COLUMN `acc_created_at` datetime NOT NULL DEFAULT '2024-05-15 00:49:09.491';--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-05-15 00:49:09.491';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-05-15 00:49:09.528';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-05-15 00:49:09.528';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-05-15 00:49:09.528';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-05-15 00:49:09.528';--> statement-breakpoint
ALTER TABLE `tran_types` ADD `tran_type_acc_type_id` varchar(60) NOT NULL;--> statement-breakpoint
ALTER TABLE `tran_types` ADD CONSTRAINT `tran_types_tran_type_acc_type_id_account_types_acc_type_id_fk` FOREIGN KEY (`tran_type_acc_type_id`) REFERENCES `account_types`(`acc_type_id`) ON DELETE cascade ON UPDATE no action;