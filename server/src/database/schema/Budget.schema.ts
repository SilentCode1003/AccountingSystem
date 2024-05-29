import {
  AnyMySqlColumn,
  date,
  decimal,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";
import employees from "./employees.schema";

const budgets = mysqlTable("budget", {
  budgetId: varchar("budget_id", { length: 60 }).primaryKey(),
  budgetEmpId: varchar("budget_emp_id", { length: 60 })
    .references((): AnyMySqlColumn => employees.empId, {
      onDelete: "cascade",
    })
    .notNull(),
  budgetAmount: decimal("budget_amount", { precision: 13, scale: 2 })
    .$type<number>()
    .notNull(),
  budgetDate: date("budget_date").notNull(),
});

export default budgets;
