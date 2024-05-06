import {
  AnyMySqlColumn,
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";
import transactions from "./transactions.schema";
import inventory from "./inventory.schema";
import { relations } from "drizzle-orm";

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
  invEntryTotalPrice: decimal("inv_entry_total_price", {
    precision: 13,
    scale: 2,
  }),
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
