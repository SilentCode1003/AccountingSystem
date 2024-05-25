import { relations } from "drizzle-orm";
import { boolean, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import transactions from "./transactions.schema";

const modesOfPayment = mysqlTable("modes_of_payment", {
  mopId: varchar("mop_id", { length: 60 }).primaryKey(),
  mopName: varchar("mop_name", { length: 60 }).notNull().unique(),
  mopIsActive: boolean("mop_is_active").notNull().default(true),
});

export const modesOfPaymentTransactionRelations = relations(
  modesOfPayment,
  ({ many }) => ({
    transactions: many(transactions),
  })
);

export default modesOfPayment;
