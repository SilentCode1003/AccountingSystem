import { relations } from "drizzle-orm";
import {
  AnyMySqlColumn,
  date,
  decimal,
  mysqlEnum,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";
import customers from "./customers.schema";
import transactions from "./transactions.schema";
import vendors from "./vendors.schema";
import inventoryEntryProducts from "./inventoryEntriesProducts.schema";

const inventoryEntries = mysqlTable("inventory_entries", {
  invEntryId: varchar("inv_entry_id", { length: 60 }).primaryKey(),
  invEntryTranId: varchar("inv_entry_tran_id", { length: 60 })
    .references((): AnyMySqlColumn => transactions.tranId, {
      onDelete: "cascade",
    })
    .notNull(),
  invEntryVdId: varchar("inv_entry_vd_id", { length: 60 }).references(
    (): AnyMySqlColumn => vendors.vdId,
    { onDelete: "cascade" }
  ),
  invEntryCustId: varchar("inv_entry_cust_id", { length: 60 }).references(
    (): AnyMySqlColumn => customers.custId,
    { onDelete: "cascade" }
  ),
  invEntryType: mysqlEnum("inv_entry_type", ["INCOMING", "OUTGOING"]).notNull(),
  invEntryTotalPrice: decimal("inv_entry_total_price", {
    precision: 13,
    scale: 2,
  })
    .$type<number>()
    .notNull(),
  invEntryDate: date("inv_entry_date").notNull(),
});

export const inventoryEntriesCustomerRelation = relations(
  inventoryEntries,
  ({ one }) => ({
    customer: one(customers, {
      fields: [inventoryEntries.invEntryCustId],
      references: [customers.custId],
    }),
  })
);

export const inventoryEntriesVendorRelation = relations(
  inventoryEntries,
  ({ one }) => ({
    vendor: one(vendors, {
      fields: [inventoryEntries.invEntryVdId],
      references: [vendors.vdId],
    }),
  })
);

export const inventoryEntriesInventoryEntryProductsManyRelation = relations(
  inventoryEntries,
  ({ many }) => ({
    inventoryEntryProducts: many(inventoryEntryProducts),
  })
);

export const inventoryEntriesTransactionRelation = relations(
  inventoryEntries,
  ({ one }) => ({
    transaction: one(transactions, {
      fields: [inventoryEntries.invEntryTranId],
      references: [transactions.tranId],
    }),
  })
);

export default inventoryEntries;
