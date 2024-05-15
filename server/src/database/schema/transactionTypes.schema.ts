import { relations } from "drizzle-orm";
import {
  AnyMySqlColumn,
  boolean,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";
import transactions from "./transactions.schema";
import accountTypes from "./accountType.schema";

const tranTypes = mysqlTable("tran_types", {
  tranTypeId: varchar("tran_type_id", { length: 60 }).primaryKey().notNull(),
  tranTypeName: varchar("tran_type_name", { length: 60 }).notNull().unique(),
  tranTypeAccTypeId: varchar("tran_type_acc_type_id", { length: 60 })
    .references((): AnyMySqlColumn => accountTypes.accTypeId, {
      onDelete: "cascade",
    })
    .notNull(),
  tranTypeIsActive: boolean("tran_type_is_active").notNull().default(true),
});

export const tranTypeAccTypeIdRelations = relations(tranTypes, ({ one }) => ({
  accountType: one(accountTypes, {
    fields: [tranTypes.tranTypeAccTypeId],
    references: [accountTypes.accTypeId],
  }),
}));

export const tranTypeTransactionManyRelations = relations(
  tranTypes,
  ({ many }) => ({
    transactions: many(transactions),
  })
);

export default tranTypes;
