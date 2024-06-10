CREATE TABLE `running_balance` (
	`rb_id` varchar(60) NOT NULL,
	`rb_budget_id` varchar(60) NOT NULL,
	`rb_liq_id` varchar(60) NOT NULL,
	`rb_return_amount` decimal(13,2) NOT NULL,
	`rb_reimbursement_amount` decimal(13,2) NOT NULL,
	`rb_emp_id` varchar(60),
	`rb_date` date NOT NULL,
	CONSTRAINT `running_balance_rb_id` PRIMARY KEY(`rb_id`)
);
--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_created_at` date NOT NULL DEFAULT '2024-06-10';--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `acc_updated_at` datetime NOT NULL DEFAULT '2024-06-10 06:49:41.805';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_created_at` datetime NOT NULL DEFAULT '2024-06-10 06:49:41.819';--> statement-breakpoint
ALTER TABLE `cheques` MODIFY COLUMN `chq_updated_at` datetime NOT NULL DEFAULT '2024-06-10 06:49:41.819';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_created_at` datetime NOT NULL DEFAULT '2024-06-10 06:49:41.804';--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `tran_updated_at` datetime NOT NULL DEFAULT '2024-06-10 06:49:41.804';--> statement-breakpoint
ALTER TABLE `running_balance` ADD CONSTRAINT `running_balance_rb_budget_id_budget_budget_id_fk` FOREIGN KEY (`rb_budget_id`) REFERENCES `budget`(`budget_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `running_balance` ADD CONSTRAINT `running_balance_rb_liq_id_liquidation_liquidation_id_fk` FOREIGN KEY (`rb_liq_id`) REFERENCES `liquidation`(`liquidation_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `running_balance` ADD CONSTRAINT `running_balance_rb_emp_id_employees_emp_id_fk` FOREIGN KEY (`rb_emp_id`) REFERENCES `employees`(`emp_id`) ON DELETE cascade ON UPDATE no action;