import { eq } from "drizzle-orm";
import { DB } from "..";

export const getForgetPasswordRequestById = async (db: DB, id: string) => {
  const forgetPasswordRequest = await db.query.forgetPasswordRequests.findFirst(
    {
      where: (forgetPasswordRequest) => eq(forgetPasswordRequest.id, id),
    }
  );

  return forgetPasswordRequest;
};
