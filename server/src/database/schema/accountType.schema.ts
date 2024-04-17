import { relations } from "drizzle-orm";
import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import accounts from "./accounts.schema";

const accountTypes = mysqlTable("account_types", {
  accTypeId: varchar("acc_type_id", { length: 60 }).primaryKey().notNull(),
  accTypeName: varchar("acc_type_name", { length: 60 }).notNull().unique(),
});

export const accountTypesAccountManyRelations = relations(
  accountTypes,
  ({ many }) => ({
    accounts: many(accounts),
  })
);

export default accountTypes;
