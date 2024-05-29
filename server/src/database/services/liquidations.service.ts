import crypto from "crypto";
import { eq } from "drizzle-orm";
import db from "..";
import liquidations from "../schema/Liquidation.schema";
import { addLiquidationRoutes } from "./liquidationRoutes.service";

export const getAllLiquidations = async () => {
  const liquidations = await db.query.liquidations.findMany({
    with: {
      employee: true,
      liquidationRoutes: true,
    },
  });
  return liquidations;
};

export const getLiquidationById = async (id: string) => {
  const liquidation = await db.query.liquidations.findFirst({
    where: eq(liquidations.liquidationId, id),
    with: {
      employee: true,
      liquidationRoutes: true,
    },
  });
  return liquidation;
};

export const addLiquidation = async (input: {
  liquidationEmpId: string;
  liquidationAmount: number;
  liquidationDate: Date;
  liquidationDestination: string;
  liquidationTranId: string;
  liquidationRoutes: Array<{
    lrDestination: string;
    lrPrice: number;
    lrFrom: string;
    lrTo: string;
    lrModeOfTransport: string;
  }>;
}) => {
  const newLiquidationId = `liquidationId ${crypto.randomUUID()}`;
  await db.insert(liquidations).values({
    ...input,
    liquidationId: newLiquidationId,
  });

  await addLiquidationRoutes({
    lrLiqId: newLiquidationId,
    liquidationRoutes: input.liquidationRoutes,
  });

  const newLiquidation = await getLiquidationById(newLiquidationId);
  return newLiquidation;
};
