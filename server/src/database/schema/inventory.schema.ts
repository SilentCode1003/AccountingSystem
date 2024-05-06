import {
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";

const inventory = mysqlTable("inventory", {
  invId: varchar("inv_id", { length: 60 }).primaryKey(),
  invAssetName: varchar("inv_asset_name", { length: 40 }).notNull().unique(),
  invStocks: int("inv_stocks").notNull(),
  invStatus: mysqlEnum("inv_status", ["GOOD", "WARNING", "DEPLETED"]),
  invPricePerUnit: decimal("inv_price_per_unit", { precision: 13, scale: 2 })
    .$type<number>()
    .notNull(),
});

export default inventory;
