import {
  AnyMySqlColumn,
  decimal,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";
import liquidations from "./Liquidation.schema";

const liquidationRoutes = mysqlTable("liquidation_routes", {
  lrId: varchar("lr", { length: 60 }).primaryKey(),
  lrLiqId: varchar("lr_liq_id", { length: 60 })
    .references((): AnyMySqlColumn => liquidations.liquidationId, {
      onDelete: "cascade",
    })
    .notNull(),
  lrPrice: decimal("lr_price", { precision: 13, scale: 2 })
    .$type<number>()
    .notNull(),
  lrFrom: varchar("lr_from", { length: 60 }).notNull(),
  lrTo: varchar("lr_to", { length: 60 }).notNull(),
  lrModeOfTransport: varchar("lr_mode_of_transport", { length: 60 }).notNull(),
});

export default liquidationRoutes;
