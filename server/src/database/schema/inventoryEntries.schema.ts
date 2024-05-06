import {
  AnyMySqlColumn,
  date,
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";
import transactions from "./transactions.schema";
import inventory from "./inventory.schema";
import { relations } from "drizzle-orm";
import vendors from "./vendors.schema";
import customers from "./customers.schema";

const inventoryEntries = mysqlTable("inventory_entries", {
  invEntryId: varchar("inv_entry_id", { length: 60 }).primaryKey(),
  invEntryTranId: varchar("inv_entry_tran_id", { length: 60 })
    .references((): AnyMySqlColumn => transactions.tranId, {
      onDelete: "cascade",
    })
    .notNull(),
  invEntryInvId: varchar("inv_entry_inv_id", { length: 60 })
    .references((): AnyMySqlColumn => inventory.invId, { onDelete: "cascade" })
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
  invEntryQuantity: int("inv_entry_quantity").notNull(),
});

export const inventoryEntriesInventoryRelations = relations(
  inventoryEntries,
  ({ one }) => ({
    Inventory: one(inventory, {
      fields: [inventoryEntries.invEntryInvId],
      references: [inventory.invId],
    }),
  })
);

export const inventoryEntriesVendorsRelations = relations(
  inventoryEntries,
  ({ one }) => ({
    Vendor: one(vendors, {
      fields: [inventoryEntries.invEntryVdId],
      references: [vendors.vdId],
    }),
  })
);

export const inventoryEntriesCustomerRelation = relations(
  inventoryEntries,
  ({ one }) => ({
    Customer: one(customers, {
      fields: [inventoryEntries.invEntryCustId],
      references: [customers.custId],
    }),
  })
);

export const inventoryEntriesVendorRelation = relations(
  inventoryEntries,
  ({ one }) => ({
    Vendor: one(vendors, {
      fields: [inventoryEntries.invEntryVdId],
      references: [vendors.vdId],
    }),
  })
);

export const inventoryEntriesTransactionRelation = relations(
  inventoryEntries,
  ({ one }) => ({
    Transaction: one(transactions, {
      fields: [inventoryEntries.invEntryTranId],
      references: [transactions.tranId],
    }),
  })
);

export default inventoryEntries;
