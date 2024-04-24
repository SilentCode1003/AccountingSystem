import { and, eq, sql, sum } from "drizzle-orm";
import db from "..";
import accountTypes from "../schema/accountType.schema";
import accounts from "../schema/accounts.schema";

const ACCTYPE_DEFAULT = {
  CASHFLOW: "CASHFLOW",
  BALANCESHEET: "BALANCESHEET",
  INCOMESTATEMENT: "INCOMESTATEMENT",
} as const;

type ObjectTypes<T> = T[keyof T];

type AccountTypeDefault = ObjectTypes<typeof ACCTYPE_DEFAULT>;

export const getAllAccountTypes = async () => {
  const accountTypes = await db.query.accountTypes.findMany({
    with: {
      accounts: true,
    },
  });
  return accountTypes;
};

export const getAccountTypeById = async (input: { accTypeId: string }) => {
  const accountType = await db.query.accountTypes.findFirst({
    where: (accType) => eq(accType.accTypeId, input.accTypeId),
    with: {
      accounts: true,
    },
  });
  return accountType;
};

export const addAccountType = async (input: {
  accTypeName: string;
  accTypeDefault: AccountTypeDefault;
}) => {
  const newAccountTypeId = `accTypeId ${crypto.randomUUID()}`;
  await db.insert(accountTypes).values({
    accTypeId: newAccountTypeId,
    accTypeName: input.accTypeName,
    accTypeDefault: input.accTypeDefault,
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
    accTypeDefault?: AccountTypeDefault;
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

export const removeAccountType = async (input: { accTypeId: string }) => {
  await db
    .delete(accountTypes)
    .where(eq(accountTypes.accTypeId, input.accTypeId));
};

export const getAccountTypeTotalPerMonthQuery = async (input: {
  accTypeId: string;
  date: Date;
}) => {
  const data = await db
    .select({
      name: accounts.accName,
      total: sum(accounts.accAmount),
    })
    .from(accounts)
    .where(
      and(
        eq(sql`month(acc_created_at)`, sql`month(${input.date})`),
        eq(sql`year(acc_created_at)`, sql`year(${input.date})`),
        eq(accounts.accTypeId, input.accTypeId)
      )
    )
    .groupBy(accounts.accName);
  return data;
};
