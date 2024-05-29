import {
  AnyMySqlColumn,
  date,
  decimal,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";
import employees from "./employees.schema";
import { relations } from "drizzle-orm";

const liquidations = mysqlTable("liquidation", {
  liquidationId: varchar("liquidation_id", { length: 60 }).primaryKey(),
  liquidationEmpId: varchar("liquidation_emp_id", { length: 60 })
    .references((): AnyMySqlColumn => employees.empId, {
      onDelete: "cascade",
    })
    .notNull(),
  liquidationAmount: decimal("liquidation_amount", { precision: 13, scale: 2 })
    .$type<number>()
    .notNull(),
  liquidationDestination: varchar("liquidation_destination", {
    length: 60,
  }).notNull(),
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

export default liquidations;