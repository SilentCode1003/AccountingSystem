CREATE TABLE `budget` (
	`budget_id` varchar(60) NOT NULL,
	`budget_emp_id` varchar(60) NOT NULL,
	`budget_amount` decimal(13,2) NOT NULL,
	`budget_date` date NOT NULL,
	CONSTRAINT `budget_budget_id` PRIMARY KEY(`budget_id`)
);
--> statement-breakpoint
CREATE TABLE `liquidation` (
	`liquidation_id` varchar(60) NOT NULL,
	`liquidation_emp_id` varchar(60) NOT NULL,
	`liquidation_amount` decimal(13,2) NOT NULL,
	`liquidation_destination` varchar(60) NOT NULL,
	`liquidation_date` date NOT NULL,
	CONSTRAINT `liquidation_liquidation_id` PRIMARY KEY(`liquidation_id`)
);
--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_created_at` date NOT NULL DEFAULT '2024-05-29';--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-05-29 01:39:38.883';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-05-29 01:39:38.894';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-05-29 01:39:38.894';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-05-29 01:39:38.882';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-05-29 01:39:38.882';--> statement-breakpoint
ALTER TABLE `budget` ADD CONSTRAINT `budget_budget_emp_id_employees_emp_id_fk` FOREIGN KEY (`budget_emp_id`) REFERENCES `employees`(`emp_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `liquidation` ADD CONSTRAINT `liquidation_liquidation_emp_id_employees_emp_id_fk` FOREIGN KEY (`liquidation_emp_id`) REFERENCES `employees`(`emp_id`) ON DELETE cascade ON UPDATE no action;