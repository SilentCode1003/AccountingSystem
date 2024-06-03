import crypto from "crypto";
import { eq } from "drizzle-orm";
import db from "..";
import liquidationRoutes from "../schema/liquidationRoutes.schema";
import { addRoute } from "./routes.service";
import { and } from "drizzle-orm";
import routes from "../schema/routes.schema";
import { addRouteDiscrepancy } from "./routesDiscrepancy.service";

export const getAllLiquidationRoutes = async () => {
  const liquidationRoutes = await db.query.liquidationRoutes.findMany();
  return liquidationRoutes;
};

export const getLiquidationRouteById = async (id: string) => {
  const liquidationRoute = await db.query.liquidationRoutes.findFirst({
    where: eq(liquidationRoutes.lrId, id),
  });

  return liquidationRoute;
};

export const addLiquidationRoutes = async (input: {
  lrLiqId: string;
  liquidationRoutes: Array<{
    lrDestination: string;
    lrPrice: number;
    lrFrom: string;
    lrTo: string;
    lrModeOfTransport: string;
  }>;
}) => {
  await Promise.all(
    input.liquidationRoutes.map(async (liquidationRoute) => {
      const newLiquidationRouteId = `lrId ${crypto.randomUUID()}`;
      await db.insert(liquidationRoutes).values({
        ...liquidationRoute,
        lrLiqId: input.lrLiqId,
        lrId: newLiquidationRouteId,
      });

      await addRoute({
        routeEnd: liquidationRoute.lrTo,
        routeStart: liquidationRoute.lrFrom,
        routePrice: liquidationRoute.lrPrice,
        routeModeOfTransport: liquidationRoute.lrModeOfTransport,
      });

      const lr = await db.query.liquidationRoutes.findFirst({
        where: eq(liquidationRoutes.lrId, newLiquidationRouteId),
      });

      const route = await db.query.routes.findFirst({
        where: and(
          eq(routes.routeStart, lr!.lrFrom),
          eq(routes.routeEnd, lr!.lrTo),
          eq(routes.routeModeOfTransport, lr!.lrModeOfTransport)
        ),
      });

      if (route?.routePrice !== lr?.lrPrice)
        await addRouteDiscrepancy({
          rdLrId: lr!.lrId,
          rdRouteId: route!.routeId,
        });
      // return;
    })
  );

  const newliquidationRoutes = await db.query.liquidationRoutes.findMany({
    where: eq(liquidationRoutes.lrLiqId, input.lrLiqId),
  });
  return newliquidationRoutes;
};
