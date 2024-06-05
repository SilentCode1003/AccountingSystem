import { eq, not } from "drizzle-orm";
import routeDiscrepancies from "../schema/routeDiscrepancies.schema";
import crypto from "crypto";
import { DB } from "..";

export const getAllRouteDiscrepancies = async (db: DB) => {
  const routeDiscrepancies = await db.query.routeDiscrepancies.findMany({
    with: {
      route: true,
      liquidationRoute: {
        with: {
          liquidation: {
            with: {
              employee: {
                columns: {
                  empName: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return routeDiscrepancies;
};

export const addRouteDiscrepancy = async (
  db: DB,
  input: {
    rdRouteId: string;
    rdLrId: string;
  }
) => {
  const rdId = `rdId ${crypto.randomUUID()}`;

  await db.insert(routeDiscrepancies).values({
    ...input,
    rdId,
  });

  const routeDiscrepancy = await db.query.routeDiscrepancies.findFirst({
    where: eq(routeDiscrepancies.rdId, rdId),
  });

  return routeDiscrepancy;
};

export const toggleRouteDiscrepancy = async (
  db: DB,
  input: {
    rdId: string;
  }
) => {
  await db
    .update(routeDiscrepancies)
    .set({
      rdIsResolved: not(routeDiscrepancies.rdIsResolved),
    })
    .where(eq(routeDiscrepancies.rdId, input.rdId));

  const routeDiscrepancy = await db.query.routeDiscrepancies.findFirst({
    where: eq(routeDiscrepancies.rdId, input.rdId),
    with: {
      route: true,
      liquidationRoute: true,
    },
  });

  return routeDiscrepancy;
};
