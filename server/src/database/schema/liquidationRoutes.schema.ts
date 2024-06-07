import {
  AnyMySqlColumn,
  decimal,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";
import liquidations from "./Liquidation.schema";
import { relations } from "drizzle-orm";

const liquidationRoutes = mysqlTable("liquidation_routes", {
  lrId: varchar("lr", { length: 60 }).primaryKey(),
  lrLiqId: varchar("lr_liq_id", { length: 60 })
    .references((): AnyMySqlColumn => liquidations.liquidationId, {
      onDelete: "cascade",
    })
    .notNull(),
  lrDestination: varchar("lr_destination", { length: 60 }).notNull(),
  lrPrice: decimal("lr_price", { precision: 13, scale: 2 })
    .$type<number>()
    .notNull(),
  lrFrom: varchar("lr_from", { length: 60 }).notNull(),
  lrTo: varchar("lr_to", { length: 60 }).notNull(),
  lrModeOfTransport: varchar("lr_mode_of_transport", { length: 60 }).notNull(),
});

export const liquidationRoutesLiquidationRelation = relations(
  liquidationRoutes,
  ({ one }) => ({
    liquidation: one(liquidations, {
      fields: [liquidationRoutes.lrLiqId],
      references: [liquidations.liquidationId],
    }),
  })
);

export default liquidationRoutes;
