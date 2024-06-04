import crypto from "crypto";
import routes from "../schema/routes.schema";
import { eq, sql } from "drizzle-orm";
import { DB } from "..";

export const getAllRoutes = async (db: DB) => {
  const allRoutes = await db.query.routes.findMany();
  return allRoutes;
};

export const getRouteById = async (db: DB, id: string) => {
  const route = await db.query.routes.findFirst({
    where: eq(routes.routeId, id),
  });
  return route;
};

export const addRoute = async (
  db: DB,
  input: {
    routeStart: string;
    routeEnd: string;
    routePrice: number;
    routeModeOfTransport: string;
  }
) => {
  const newRouteId = `routeId ${crypto.randomUUID()}`;

  await db
    .insert(routes)
    .values({ ...input, routeId: newRouteId })
    .onDuplicateKeyUpdate({
      set: {
        routeId: sql`route_id`,
      },
    });

  const newRoute = await getRouteById(db, newRouteId);
  return newRoute;
};

export const editRoute = async (
  db: DB,
  input: {
    routeId: string;
    newData: {
      routeStart: string;
      routeEnd: string;
      routePrice: number;
      routeModeOfTransport: string;
    };
  }
) => {
  await db
    .update(routes)
    .set(input.newData)
    .where(eq(routes.routeId, input.routeId));
};
