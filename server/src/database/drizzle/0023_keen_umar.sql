ALTER TABLE `accounts` MODIFY COLUMN `acc_created_at` datetime NOT NULL DEFAULT '2024-05-06 05:53:20.240';--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-05-06 05:53:20.240';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-05-06 05:53:20.250';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-05-06 05:53:20.250';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-05-06 05:53:20.280';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-05-06 05:53:20.280';--> statement-breakpoint
ALTER TABLE `inventory_entries` ADD `inv_entry_vd_id` varchar(60) NOT NULL;--> statement-breakpoint
ALTER TABLE `inventory_entries` ADD `inv_entry_cust_id` varchar(60);--> statement-breakpoint
ALTER TABLE `inventory_entries` ADD CONSTRAINT `inventory_entries_inv_entry_vd_id_vendors_vd_id_fk` FOREIGN KEY (`inv_entry_vd_id`) REFERENCES `vendors`(`vd_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inventory_entries` ADD CONSTRAINT `inventory_entries_inv_entry_cust_id_customers_cust_id_fk` FOREIGN KEY (`inv_entry_cust_id`) REFERENCES `customers`(`cust_id`) ON DELETE cascade ON UPDATE no action;