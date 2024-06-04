import {
  AnyMySqlColumn,
  boolean,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";
import routes from "./routes.schema";
import liquidationRoutes from "./liquidationRoutes.schema";
import { relations } from "drizzle-orm";

const routeDiscrepancies = mysqlTable("route_discrepancies", {
  rdId: varchar("rd_id", { length: 60 }).primaryKey(),
  rdRouteId: varchar("rd_route_id", { length: 60 })
    .references(() => routes.routeId, {
      onDelete: "cascade",
    })
    .notNull(),
  rdLrId: varchar("rd_lr_id", { length: 60 })
    .references((): AnyMySqlColumn => liquidationRoutes.lrId, {
      onDelete: "cascade",
    })
    .notNull(),
  rdIsResolved: boolean("rd_is_resolved").notNull().default(false),
});

export const routeDiscrepancyRouteRelation = relations(
  routeDiscrepancies,
  ({ one }) => ({
    route: one(routes, {
      fields: [routeDiscrepancies.rdRouteId],
      references: [routes.routeId],
    }),
  })
);

export const routeDiscrepancyLiquidationRouteRelation = relations(
  routeDiscrepancies,
  ({ one }) => ({
    liquidationRoute: one(liquidationRoutes, {
      fields: [routeDiscrepancies.rdLrId],
      references: [liquidationRoutes.lrId],
    }),
  })
);

export default routeDiscrepancies;
