import { relations } from "drizzle-orm";
import {
  AnyMySqlColumn,
  decimal,
  int,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";
import inventory from "./inventory.schema";
import inventoryEntries from "./inventoryEntries.schema";

const inventoryEntryProducts = mysqlTable("ie_products", {
  iepId: varchar("iep_id", { length: 60 }).primaryKey(),
  iepInvEntryId: varchar("iep_inv_ent_id", { length: 60 })
    .references((): AnyMySqlColumn => inventoryEntries.invEntryId, {
      onDelete: "cascade",
    })
    .notNull(),
  iepInvId: varchar("iep_inv_id", { length: 60 })
    .references((): AnyMySqlColumn => inventory.invId, { onDelete: "cascade" })
    .notNull(),
  iepTotalPrice: decimal("iep_total_price", {
    precision: 13,
    scale: 2,
  })
    .$type<number>()
    .notNull(),
  iepQuantity: int("iep_quantity").notNull(),
});

export const inventoryEntriesProductsInventoryEntryRelations = relations(
  inventoryEntryProducts,
  ({ one }) => ({
    inventoryEntry: one(inventoryEntries, {
      fields: [inventoryEntryProducts.iepInvEntryId],
      references: [inventoryEntries.invEntryId],
    }),
  })
);

export const inventoryEntriesProductsInventoryRelations = relations(
  inventoryEntryProducts,
  ({ one }) => ({
    inventory: one(inventory, {
      fields: [inventoryEntryProducts.iepInvId],
      references: [inventory.invId],
    }),
  })
);

export default inventoryEntryProducts;
