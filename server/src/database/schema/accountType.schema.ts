import { relations } from "drizzle-orm";
import {
  boolean,
  mysqlEnum,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";
import accounts from "./accounts.schema";
import tranTypes from "./transactionTypes.schema";

const accountTypes = mysqlTable("account_types", {
  accTypeId: varchar("acc_type_id", { length: 60 }).primaryKey().notNull(),
  accTypeName: varchar("acc_type_name", { length: 60 }).notNull().unique(),
  accTypeIsProfit: boolean("acc_type_is_profit").notNull().default(true),
  accTypeIsActive: boolean("acc_type_is_active").notNull().default(true),
  accTypeDefault: mysqlEnum("acc_type_default", [
    "BALANCESHEET",
    "CASHFLOW",
    "INCOMESTATEMENT",
  ]).notNull(),
});

export const accountTypesAccountManyRelations = relations(
  accountTypes,
  ({ many }) => ({
    accounts: many(accounts),
  })
);

export const accountTypeTransactionTypeManyRelations = relations(
  accountTypes,
  ({ many }) => ({
    transactionTypes: many(tranTypes),
  })
);

export default accountTypes;
