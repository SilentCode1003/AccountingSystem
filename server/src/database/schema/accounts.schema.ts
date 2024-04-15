import {
  boolean,
  datetime,
  decimal,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";
import accountTypes from "./accountType.schema";
import { relations } from "drizzle-orm";

const accounts = mysqlTable("accounts", {
  accId: varchar("acc_id", { length: 60 }).primaryKey(),
  accTypeId: varchar("acc_type_id", { length: 60 })
    .references(() => accountTypes.accTypeId, { onDelete: "cascade" })
    .notNull(),
  accAmount: decimal("acc_amount", { precision: 13, scale: 2 })
    .$type<number>()
    .notNull(),
  accDescription: text("acc_description").notNull(),
  accIsActive: boolean("acc_is_active").notNull().default(true),
  accCreatedAt: datetime("acc_created_at").notNull().default(new Date()),
  accUpdatedAt: datetime("acc_updated_at").notNull().default(new Date()),
});

export const accountTypeRelation = relations(accounts, ({ one }) => ({
  accountType: one(accountTypes, {
    fields: [accounts.accTypeId],
    references: [accountTypes.accTypeId],
  }),
}));

export default accounts;
