import { eq } from "drizzle-orm";
import db from "..";
import routeDiscrepancies from "../schema/routeDiscrepancies.schema";
import crypto from "crypto";

export const addRouteDiscrepancy = async (input: {
  rdRouteId: string;
  rdLrId: string;
}) => {
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
