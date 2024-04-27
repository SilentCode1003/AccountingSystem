ALTER TABLE `users` RENAME COLUMN `emp_name` TO `user_fullname`;--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN `emp_contact_info` TO `user_contact_number`;--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_created_at` datetime NOT NULL DEFAULT '2024-04-18 07:00:03.517';--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-04-18 07:00:03.517';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-04-18 07:00:03.523';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-04-18 07:00:03.523';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-04-18 07:00:03.548';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-04-18 07:00:03.548';