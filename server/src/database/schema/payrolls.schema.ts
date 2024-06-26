import {
  AnyMySqlColumn,
  date,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";
import employees from "./employees.schema";
import { decimal } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import transactions from "./transactions.schema";

const payrolls = mysqlTable("payrolls", {
  prId: varchar("pr_id", { length: 60 }).primaryKey(),
  prTranId: varchar("pr_transaction_id", { length: 60 })
    .references((): AnyMySqlColumn => transactions.tranId, {
      onDelete: "cascade",
    })
    .notNull(),
  prEmployeeId: varchar("pr_employee_id", { length: 60 })
    .references((): AnyMySqlColumn => employees.empId, { onDelete: "cascade" })
    .notNull(),
  prTotalDeduction: decimal("pr_total_deduction", { precision: 13, scale: 2 })
    .$type<number>()
    .notNull(),
  prDateFrom: date("pr_date_from").notNull(),
  prDateTo: date("pr_date_to").notNull(),
  prFinalAmount: decimal("pr_final_amount", {
    precision: 13,
    scale: 2,
  }).$type<number>(),
});

export const payrollEmployeeRelation = relations(payrolls, ({ one }) => ({
  employee: one(employees, {
    fields: [payrolls.prEmployeeId],
    references: [employees.empId],
  }),
}));

export const payrollTransactionrelation = relations(payrolls, ({ one }) => ({
  transaction: one(transactions, {
    fields: [payrolls.prTranId],
    references: [transactions.tranId],
  }),
}));

export default payrolls;
