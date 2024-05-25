ALTER TABLE `employees` DROP INDEX `employees_emp_email_unique`;--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_created_at` date NOT NULL DEFAULT '2024-05-25';--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-05-25 01:47:20.653';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-05-25 01:47:20.660';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-05-25 01:47:20.660';--> statement-breakpoint
ALTER TABLE `employees` MODIFY COLUMN `emp_email` varchar(50) NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-05-25 01:47:20.653';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-05-25 01:47:20.653';