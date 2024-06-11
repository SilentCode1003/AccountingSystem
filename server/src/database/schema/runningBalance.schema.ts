import {
  AnyMySqlColumn,
  date,
  decimal,
  int,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";
import liquidations from "./Liquidation.schema";
import employees from "./employees.schema";
import { relations } from "drizzle-orm";

export const runningBalance = mysqlTable("running_balance", {
  id: int("id"),
  rbId: varchar("rb_id", { length: 60 }).primaryKey(),
  rbBudget: decimal("rb_budget", {
    precision: 13,
    scale: 2,
  })
    .$type<number>()
    .notNull(),
  rbLiqId: varchar("rb_liq_id", { length: 60 })
    .references((): AnyMySqlColumn => liquidations.liquidationId, {
      onDelete: "cascade",
    })
    .notNull(),
  rbReturnAmount: decimal("rb_return_amount", {
    precision: 13,
    scale: 2,
  })
    .$type<number>()
    .notNull(),
  rbReimbursementAmount: decimal("rb_reimbursement_amount", {
    precision: 13,
    scale: 2,
  })
    .$type<number>()
    .notNull(),
  rbEmpId: varchar("rb_emp_id", { length: 60 }).references(
    (): AnyMySqlColumn => employees.empId,
    {
      onDelete: "cascade",
    }
  ),
  rbDate: date("rb_date").notNull(),
});

export const runningBalanceEmployeeRelation = relations(
  runningBalance,
  ({ one }) => ({
    employee: one(employees, {
      fields: [runningBalance.rbEmpId],
      references: [employees.empId],
    }),
  })
);

export const runningBalanceLiquidationRelation = relations(
  runningBalance,
  ({ one }) => ({
    liquidation: one(liquidations, {
      fields: [runningBalance.rbLiqId],
      references: [liquidations.liquidationId],
    }),
  })
);
