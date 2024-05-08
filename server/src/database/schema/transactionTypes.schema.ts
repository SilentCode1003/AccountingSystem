import { relations } from "drizzle-orm";
import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import transactions from "./transactions.schema";

const tranTypes = mysqlTable("tran_types", {
  tranTypeId: varchar("tran_type_id", { length: 60 }).primaryKey().notNull(),
  tranTypeName: varchar("tran_type_name", { length: 60 }).notNull().unique(),
});

export const tranTypeTransactionManyRelations = relations(
  tranTypes,
  ({ many }) => ({
    transactions: many(transactions),
  })
);

export default tranTypes;
