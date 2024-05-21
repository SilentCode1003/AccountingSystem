ALTER TABLE `accounts` MODIFY COLUMN `acc_created_at` datetime NOT NULL DEFAULT '2024-05-20 01:42:46.285';--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-05-20 01:42:46.285';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-05-20 01:42:46.318';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-05-20 01:42:46.318';--> statement-breakpoint
ALTER TABLE `employees` MODIFY COLUMN `emp_salary` decimal(13,2) NOT NULL DEFAULT 15000;--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-05-20 01:42:46.318';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-05-20 01:42:46.318';--> statement-breakpoint
ALTER TABLE `employees` ADD `emp_job_status` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `employees` ADD `emp_department` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `employees` ADD `emp_position` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `employees` DROP COLUMN `emp_address`;--> statement-breakpoint
ALTER TABLE `employees` DROP COLUMN `emp_birthdate`;