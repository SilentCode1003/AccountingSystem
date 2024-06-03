import { decimal, mysqlTable, unique, varchar } from "drizzle-orm/mysql-core";

const routes = mysqlTable(
  "routes",
  {
    routeId: varchar("route_id", { length: 60 }).primaryKey(),
    routeStart: varchar("route_start", { length: 60 }),
    routeEnd: varchar("route_end", { length: 60 }),
    routePrice: decimal("route_price", { precision: 13, scale: 2 })
      .notNull()
      .$type<number>(),
    routeModeOfTransport: varchar("route_mode_of_transport", { length: 60 }),
  },
  (t) => ({
    unq: unique().on(t.routeStart, t.routeEnd, t.routeModeOfTransport),
  })
);

export default routes;
