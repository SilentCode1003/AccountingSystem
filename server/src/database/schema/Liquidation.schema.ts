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
import liquidationRoutes from "./liquidationRoutes.schema";

const liquidations = mysqlTable("liquidation", {
  liquidationId: varchar("liquidation_id", { length: 60 }).primaryKey(),
  liquidationRT: varchar("liquidation_rt", { length: 60 }).notNull(),
  liquidationTranId: varchar("liquidation_tran_id", { length: 60 })
    .references((): AnyMySqlColumn => transactions.tranId, {
      onDelete: "cascade",
    })
    .notNull(),
  liquidationEmpId: varchar("liquidation_emp_id", { length: 60 })
    .references((): AnyMySqlColumn => employees.empId, {
      onDelete: "cascade",
    })
    .notNull(),
  liquidationAmount: decimal("liquidation_amount", { precision: 13, scale: 2 })
    .$type<number>()
    .notNull(),
  liquidationDate: date("liquidation_date").notNull(),
});

export const liquidationEmployeeRelation = relations(
  liquidations,
  ({ one }) => ({
    employee: one(employees, {
      fields: [liquidations.liquidationEmpId],
      references: [employees.empId],
    }),
  })
);

export const liquidationRouteRelations = relations(
  liquidations,
  ({ many }) => ({
    liquidationRoutes: many(liquidationRoutes),
  })
);

export default liquidations;
