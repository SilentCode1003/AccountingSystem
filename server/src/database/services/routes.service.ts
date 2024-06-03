import db from "..";
import crypto from "crypto";
import routes from "../schema/routes.schema";
import { eq, sql } from "drizzle-orm";

export const getAllRoutes = async () => {
  const allRoutes = await db.query.routes.findMany();
  return allRoutes;
};

export const getRouteById = async (id: string) => {
  const route = await db.query.routes.findFirst({
    where: eq(routes.routeId, id),
  });
  return route;
};

export const addRoute = async (input: {
  routeStart: string;
  routeEnd: string;
  routePrice: number;
  routeModeOfTransport: string;
}) => {
  const newRouteId = `routeId ${crypto.randomUUID()}`;

  await db
    .insert(routes)
    .values({ ...input, routeId: newRouteId })
    .onDuplicateKeyUpdate({
      set: {
        routeId: sql`route_id`,
      },
    });

  const newRoute = await getRouteById(newRouteId);
  return newRoute;
};

export const editRoute = async (input: {
  routeId: string;
  newData: {
    routeStart: string;
    routeEnd: string;
    routePrice: number;
    routeModeOfTransport: string;
  };
}) => {
  await db
    .update(routes)
    .set(input.newData)
    .where(eq(routes.routeId, input.routeId));
};
