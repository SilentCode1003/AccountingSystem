ALTER TABLE `accounts` MODIFY COLUMN `acc_created_at` date NOT NULL DEFAULT '2024-05-27';--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-05-27 01:34:45.495';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-05-27 01:34:45.503';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-05-27 01:34:45.503';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-05-27 01:34:45.494';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-05-27 01:34:45.494';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `user_fullname` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `user_profile_pic` text NOT NULL DEFAULT ('default-img.png');