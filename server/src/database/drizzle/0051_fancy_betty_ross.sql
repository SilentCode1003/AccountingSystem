CREATE TABLE `route_discrepancies` (
	`rd_id` varchar(60) NOT NULL,
	`rd_route_id` varchar(60) NOT NULL,
	`rd_lr_id` varchar(60) NOT NULL,
	CONSTRAINT `route_discrepancies_rd_id` PRIMARY KEY(`rd_id`)
);
--> statement-breakpoint
CREATE TABLE `routes` (
	`route_id` varchar(60) NOT NULL,
	`route_start` varchar(60),
	`route_end` varchar(60),
	`route_price` decimal(13,2) NOT NULL,
	`route_mode_of_transport` varchar(60),
	CONSTRAINT `routes_route_id` PRIMARY KEY(`route_id`)
);
--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_created_at` date NOT NULL DEFAULT '2024-06-03';--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-06-03 06:14:47.085';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-06-03 06:14:47.096';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-06-03 06:14:47.096';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-06-03 06:14:47.084';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-06-03 06:14:47.084';--> statement-breakpoint
ALTER TABLE `liquidation` ADD `liquidation_rt` varchar(60) NOT NULL;--> statement-breakpoint
ALTER TABLE `route_discrepancies` ADD CONSTRAINT `route_discrepancies_rd_route_id_routes_route_id_fk` FOREIGN KEY (`rd_route_id`) REFERENCES `routes`(`route_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `route_discrepancies` ADD CONSTRAINT `route_discrepancies_rd_lr_id_liquidation_routes_lr_fk` FOREIGN KEY (`rd_lr_id`) REFERENCES `liquidation_routes`(`lr`) ON DELETE cascade ON UPDATE no action;