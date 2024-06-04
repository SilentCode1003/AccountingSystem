import * as bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import randomstring from "randomstring";
import { DB } from "..";
import apiKeys from "../schema/apiKeyStore.schema";

export const getAksById = async (db: DB, aksId: string) => {
  const aks = await db.query.apiKeys.findFirst({
    where: eq(apiKeys.aksId, aksId),
  });

  return aks;
};

export const generateAks = async (db: DB, input: { aksUserName: string }) => {
  const aksId = randomstring.generate({
    length: 16,
  });

  const hashedString = await bcrypt.hash(
    randomstring.generate({
      length: 16,
    }),
    10
  );

  const apiKey = `${aksId}${hashedString}`;

  const aks = await db.insert(apiKeys).values({
    aksId,
    aksHashedKey: hashedString,
    aksUserName: input.aksUserName,
  });

  return apiKey;
};
