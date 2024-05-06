CREATE TABLE `inventory_entries` (
	`inv_entry_id` varchar(60) NOT NULL,
	`inv_entry_tran_id` varchar(60) NOT NULL,
	`inv_entry_inv_id` varchar(60) NOT NULL,
	`inv_status` enum('GOOD','WARNING','DEPLETED'),
	CONSTRAINT `inventory_entries_inv_entry_id` PRIMARY KEY(`inv_entry_id`)
);
--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_created_at` datetime NOT NULL DEFAULT '2024-05-06 03:13:39.279';--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-05-06 03:13:39.279';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-05-06 03:13:39.288';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-05-06 03:13:39.288';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-05-06 03:13:39.316';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-05-06 03:13:39.316';--> statement-breakpoint
ALTER TABLE `inventory_entries` ADD CONSTRAINT `inventory_entries_inv_entry_tran_id_transactions_tran_id_fk` FOREIGN KEY (`inv_entry_tran_id`) REFERENCES `transactions`(`tran_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inventory_entries` ADD CONSTRAINT `inventory_entries_inv_entry_inv_id_inventory_inv_id_fk` FOREIGN KEY (`inv_entry_inv_id`) REFERENCES `inventory`(`inv_id`) ON DELETE cascade ON UPDATE no action;