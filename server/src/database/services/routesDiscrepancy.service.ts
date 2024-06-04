import { eq } from "drizzle-orm";
import routeDiscrepancies from "../schema/routeDiscrepancies.schema";
import crypto from "crypto";
import { DB } from "..";

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
