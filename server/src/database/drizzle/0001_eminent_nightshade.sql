ALTER TABLE `accounts` MODIFY COLUMN `acc_id` varchar(60) NOT NULL;--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_type` enum('PAYABLE','RECEIVABLE','REVENUE','EXPENSE') NOT NULL;--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_created_at` datetime NOT NULL DEFAULT '2024-04-08 00:16:08.771';--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-04-08 00:16:08.771';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_id` varchar(60) NOT NULL;--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_amount` decimal(13,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_account_id` varchar(60) NOT NULL;--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-04-08 00:16:08.776';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-04-08 00:16:08.776';--> statement-breakpoint
ALTER TABLE `customers` MODIFY COLUMN `cust_id` varchar(60) NOT NULL;--> statement-breakpoint
ALTER TABLE `customers` MODIFY COLUMN `cust_contact_info` varchar(15) NOT NULL;--> statement-breakpoint
ALTER TABLE `employees` MODIFY COLUMN `emp_id` varchar(60) NOT NULL;--> statement-breakpoint
ALTER TABLE `employees` MODIFY COLUMN `emp_contact_info` varchar(15) NOT NULL;--> statement-breakpoint
ALTER TABLE `employees` MODIFY COLUMN `emp_date_terminated` date;--> statement-breakpoint
ALTER TABLE `employees` MODIFY COLUMN `emp_salary` decimal(13,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `inventory` MODIFY COLUMN `inv_id` varchar(60) NOT NULL;--> statement-breakpoint
ALTER TABLE `payrolls` MODIFY COLUMN `pr_id` varchar(60) NOT NULL;--> statement-breakpoint
ALTER TABLE `payrolls` MODIFY COLUMN `pr_employee_id` varchar(60) NOT NULL;--> statement-breakpoint
ALTER TABLE `payrolls` MODIFY COLUMN `pr_total_deduction` decimal(13,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `payrolls` MODIFY COLUMN `pr_final_amount` decimal(13,2);--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_id` varchar(60) NOT NULL;--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_account_id` varchar(60) NOT NULL;--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_amount` decimal(13,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_employee_id` varchar(60);--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_vendor_id` varchar(60);--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_customer_id` varchar(60);--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-04-08 00:16:08.802';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-04-08 00:16:08.802';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `user_id` varchar(60) NOT NULL;--> statement-breakpoint
ALTER TABLE `vendors` MODIFY COLUMN `vd_id` varchar(60) NOT NULL;--> statement-breakpoint
ALTER TABLE `vendors` MODIFY COLUMN `vd_contact_info` varchar(15) NOT NULL;--> statement-breakpoint
ALTER TABLE `accounts` ADD `acc_amount` decimal(13,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `employees` ADD `emp_name` varchar(50);--> statement-breakpoint
ALTER TABLE `cheques` DROP COLUMN `chq_description`;