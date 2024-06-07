ALTER TABLE `routes` DROP INDEX `routes_route_start_route_end_unique`;--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-06-03 07:39:48.578';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-06-03 07:39:48.591';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-06-03 07:39:48.591';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-06-03 07:39:48.577';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-06-03 07:39:48.577';--> statement-breakpoint
ALTER TABLE `routes` ADD CONSTRAINT `routes_route_start_route_end_route_mode_of_transport_unique` UNIQUE(`route_start`,`route_end`,`route_mode_of_transport`);