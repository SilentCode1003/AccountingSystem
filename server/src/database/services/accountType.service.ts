import { eq } from "drizzle-orm";
import db from "..";
import accountTypes from "../schema/accountType.schema";

export const getAllAccountTypes = async () => {
  const accountTypes = await db.query.accountTypes.findMany();
  return accountTypes;
};

export const getAccountTypeById = async (input: { accTypeId: string }) => {
  const accountType = await db.query.accountTypes.findFirst({
    where: (accType) => eq(accType.accTypeId, input.accTypeId),
  });
  return accountType;
};

export const addAccountType = async (input: { accTypeName: string }) => {
  const newAccountTypeId = `accTypeId ${crypto.randomUUID()}`;
  await db.insert(accountTypes).values({
    accTypeId: newAccountTypeId,
    accTypeName: input.accTypeName,
  });

  const newAccountType = await getAccountTypeById({
    accTypeId: newAccountTypeId,
  });
  return newAccountType;
};

export const editAccountType = async (input: {
  accTypeId: string;
  newData: {
    accTypeName?: string;
  };
}) => {
  await db
    .update(accountTypes)
    .set(input.newData)
    .where(eq(accountTypes.accTypeId, input.accTypeId));
  const updatedAccountType = await getAccountTypeById({
    accTypeId: input.accTypeId,
  });

  return updatedAccountType;
};
