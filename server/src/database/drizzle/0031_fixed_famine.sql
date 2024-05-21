CREATE TABLE IF NOT EXISTS  `modes_of_payment` (
	`mop_id` varchar(60) NOT NULL,
	`mop_name` varchar(60) NOT NULL,
	CONSTRAINT `modes_of_payment_mop_id` PRIMARY KEY(`mop_id`)
);
--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_created_at` datetime NOT NULL DEFAULT '2024-05-21 00:55:35.880';--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-05-21 00:55:35.880';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-05-21 00:55:35.889';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-05-21 00:55:35.889';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-05-21 00:55:35.880';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-05-21 00:55:35.880';--> statement-breakpoint
ALTER TABLE `transactions` ADD `tran_mop` varchar(60);--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_tran_mop_modes_of_payment_mop_id_fk` FOREIGN KEY (`tran_mop`) REFERENCES `modes_of_payment`(`mop_id`) ON DELETE cascade ON UPDATE no action;