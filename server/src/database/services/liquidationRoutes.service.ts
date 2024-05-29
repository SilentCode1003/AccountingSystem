import { eq } from "drizzle-orm";
import db from "..";
import liquidationRoutes from "../schema/liquidationRoutes.schema";

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
    })
  );

  const newliquidationRoutes = await db.query.liquidationRoutes.findMany({
    where: eq(liquidationRoutes.lrLiqId, input.lrLiqId),
  });
  return newliquidationRoutes;
};
