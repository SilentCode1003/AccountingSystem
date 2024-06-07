ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-05-27 08:27:53.556';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-05-27 08:27:53.564';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-05-27 08:27:53.564';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-05-27 08:27:53.555';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-05-27 08:27:53.555';--> statement-breakpoint
ALTER TABLE `users` ADD `user_email` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_user_email_unique` UNIQUE(`user_email`);