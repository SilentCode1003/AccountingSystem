CREATE TABLE `ie_products` (
	`iep_id` varchar(60) NOT NULL,
	`iep_inv_ent_id` varchar(60) NOT NULL,
	`iep_inv_id` varchar(60) NOT NULL,
	`iep_total_price` decimal(13,2) NOT NULL,
	`iep_quantity` int NOT NULL,
	CONSTRAINT `ie_products_iep_id` PRIMARY KEY(`iep_id`)
);
--> statement-breakpoint
ALTER TABLE `inventory_entries` DROP FOREIGN KEY `inventory_entries_inv_entry_inv_id_inventory_inv_id_fk`;
--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_created_at` datetime NOT NULL DEFAULT '2024-05-15 03:04:04.607';--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-05-15 03:04:04.607';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-05-15 03:04:04.636';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-05-15 03:04:04.636';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-05-15 03:04:04.636';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-05-15 03:04:04.636';--> statement-breakpoint
ALTER TABLE `ie_products` ADD CONSTRAINT `ie_products_iep_inv_ent_id_inventory_entries_inv_entry_id_fk` FOREIGN KEY (`iep_inv_ent_id`) REFERENCES `inventory_entries`(`inv_entry_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ie_products` ADD CONSTRAINT `ie_products_iep_inv_id_inventory_inv_id_fk` FOREIGN KEY (`iep_inv_id`) REFERENCES `inventory`(`inv_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inventory_entries` DROP COLUMN `inv_entry_inv_id`;--> statement-breakpoint
ALTER TABLE `inventory_entries` DROP COLUMN `inv_entry_quantity`;