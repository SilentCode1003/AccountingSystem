CREATE TABLE `liquidation_routes` (
	`lr` varchar(60) NOT NULL,
	`lr_liq_id` varchar(60) NOT NULL,
	`lr_price` decimal(13,2) NOT NULL,
	`lr_from` varchar(60) NOT NULL,
	`lr_to` varchar(60) NOT NULL,
	`lr_mode_of_transport` varchar(60) NOT NULL,
	CONSTRAINT `liquidation_routes_lr` PRIMARY KEY(`lr`)
);
--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-05-29 05:21:56.772';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-05-29 05:21:56.784';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-05-29 05:21:56.784';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-05-29 05:21:56.770';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-05-29 05:21:56.770';--> statement-breakpoint
ALTER TABLE `budget` ADD `budget_tran_id` varchar(60) NOT NULL;--> statement-breakpoint
ALTER TABLE `liquidation` ADD `liquidation_tran_id` varchar(60) NOT NULL;--> statement-breakpoint
ALTER TABLE `liquidation_routes` ADD CONSTRAINT `liquidation_routes_lr_liq_id_liquidation_liquidation_id_fk` FOREIGN KEY (`lr_liq_id`) REFERENCES `liquidation`(`liquidation_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `budget` ADD CONSTRAINT `budget_budget_tran_id_transactions_tran_id_fk` FOREIGN KEY (`budget_tran_id`) REFERENCES `transactions`(`tran_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `liquidation` ADD CONSTRAINT `liquidation_liquidation_tran_id_transactions_tran_id_fk` FOREIGN KEY (`liquidation_tran_id`) REFERENCES `transactions`(`tran_id`) ON DELETE cascade ON UPDATE no action;