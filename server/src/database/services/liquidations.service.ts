import crypto from "crypto";
import { eq } from "drizzle-orm";
import liquidations from "../schema/Liquidation.schema";
import { addLiquidationRoutes } from "./liquidationRoutes.service";
import { desc } from "drizzle-orm";
import { DB } from "..";

export const getAllLiquidations = async (db: DB) => {
  const allLiquidations = await db.query.liquidations.findMany({
    with: {
      employee: true,
      liquidationRoutes: true,
    },
    orderBy: [desc(liquidations.liquidationDate)],
  });

  return allLiquidations;
};

export const getLiquidationById = async (db: DB, id: string) => {
  const liquidation = await db.query.liquidations.findFirst({
    where: eq(liquidations.liquidationId, id),
    with: {
      employee: true,
      liquidationRoutes: true,
    },
  });
  return liquidation;
};

export const addLiquidation = async (
  db: DB,
  input: {
    liquidationEmpId: string;
    liquidationAmount: number;
    liquidationDate: Date;
    liquidationTranId: string;
    liquidationRoutes: Array<{
      lrDestination: string;
      lrPrice: number;
      lrFrom: string;
      lrTo: string;
      lrModeOfTransport: string;
    }>;
  }
) => {
  const newLiquidationId = `liquidationId ${crypto.randomUUID()}`;
  await db.insert(liquidations).values({
    ...input,
    liquidationId: newLiquidationId,
  });

  await addLiquidationRoutes(db, {
    lrLiqId: newLiquidationId,
    liquidationRoutes: input.liquidationRoutes,
  });

  const newLiquidation = await getLiquidationById(db, newLiquidationId);
  return newLiquidation;
};
