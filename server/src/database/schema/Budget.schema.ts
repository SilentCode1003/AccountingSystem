import {
  AnyMySqlColumn,
  date,
  decimal,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";
import employees from "./employees.schema";
import { relations } from "drizzle-orm";
import transactions from "./transactions.schema";

const budgets = mysqlTable("budget", {
  budgetId: varchar("budget_id", { length: 60 }).primaryKey(),
  budgetTranId: varchar("budget_tran_id", { length: 60 })
    .references((): AnyMySqlColumn => transactions.tranId, {
      onDelete: "cascade",
    })
    .notNull(),
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

export const budgetEmployeeRelation = relations(budgets, ({ one }) => ({
  employee: one(employees, {
    fields: [budgets.budgetEmpId],
    references: [employees.empId],
  }),
}));

export default budgets;
