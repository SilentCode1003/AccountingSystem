import {
  date,
  datetime,
  mysqlEnum,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { decimal, int } from "drizzle-orm/mysql-core";
import transactions from "./transactions.schema";

const cheques = mysqlTable("cheques", {
  chqId: varchar("chq_id", { length: 60 }).primaryKey(),
  chqPayeeName: varchar("chq_payee_name", { length: 50 }).notNull(),
  chqNumber: varchar("chq_number", { length: 50 }).notNull().unique(),
  chqApprovalCount: int("chq_approval_count").notNull().default(0),
  chqAmount: decimal("chq_amount", { precision: 13, scale: 2 })
    .$type<number>()
    .notNull(),
  chqIssueDate: date("chq_issue_date").notNull(),
  chqStatus: mysqlEnum("chq_status", ["APPROVED", "PENDING", "REJECTED"]),
  chqTranId: varchar("chq_transaction_id", { length: 60 })
    .references(() => transactions.tranId, { onDelete: "cascade" })
    .notNull(),
  chqCreatedAt: datetime("chq_created_at").notNull().default(new Date()),
  chqUpdatedAt: datetime("chq_updated_at").notNull().default(new Date()),
});

export const chequesRelations = relations(cheques, ({ one }) => ({
  transaction: one(transactions, {
    fields: [cheques.chqTranId],
    references: [transactions.tranId],
  }),
}));

export default cheques;
