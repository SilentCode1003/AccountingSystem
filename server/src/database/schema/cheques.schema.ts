import {
  date,
  datetime,
  mysqlEnum,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";
import accounts from "./accounts.schema";
import { relations } from "drizzle-orm";
import { decimal, int } from "drizzle-orm/mysql-core";

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
  chqAccId: varchar("chq_account_id", { length: 60 })
    .references(() => accounts.accId, { onDelete: "cascade" })
    .notNull(),
  chqCreatedAt: datetime("chq_created_at").notNull().default(new Date()),
  chqUpdatedAt: datetime("chq_updated_at").notNull().default(new Date()),
});

export const chequesRelations = relations(cheques, ({ one }) => ({
  account: one(accounts, {
    fields: [cheques.chqAccId],
    references: [accounts.accId],
  }),
}));

export default cheques;
