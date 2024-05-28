import { eq } from "drizzle-orm";
import db from "..";

export const getForgetPasswordRequestById = async (id: string) => {
  const forgetPasswordRequest = await db.query.forgetPasswordRequests.findFirst(
    {
      where: (forgetPasswordRequest) => eq(forgetPasswordRequest.id, id),
    }
  );

  return forgetPasswordRequest;
};
