import db from "../index";
import accounts from "../schema/accounts.schema";
import { eq, not } from "drizzle-orm";

const ACCOUNT_TYPE = {
  RECEIVABLE: "RECEIVABLE",
  PAYABLE: "PAYABLE",
  REVENUE: "REVENUE",
  EXPENSE: "EXPENSE",
} as const;

type ObjectTypes<T> = T[keyof T];

type AccountType = ObjectTypes<typeof ACCOUNT_TYPE>;

export const getAllAccounts = async () => {
  const accounts = await db.query.accounts.findMany();

  return accounts;
};

export const getAccountByID = async (accId: string) => {
  const account = await db.query.accounts.findFirst({
    where: (account) => eq(account.accId, accId),
  });

  return account;
};

export const addAccount = async (input: {
  accType: AccountType;
  accDescription: string;
  accAmount: number;
}) => {
  const newAccountId = `accId ${crypto.randomUUID()}`;

  await db.insert(accounts).values({ ...input, accId: newAccountId });

  const newAccount = await db.query.accounts.findFirst({
    where: (account) => eq(account.accId, newAccountId),
  });

  return newAccount;
};

export const editAccount = async (input: {
  accId: string;
  newData: {
    accType?: AccountType;
    accDescription?: string;
    accAmount?: number;
  };
}) => {
  await db
    .update(accounts)
    .set({ ...input.newData, accUpdatedAt: new Date() })
    .where(eq(accounts.accId, input.accId));

  const updatedAcc = await db.query.accounts.findFirst({
    where: (acc) => eq(acc.accId, input.accId),
  });

  return updatedAcc;
};

export const updateAccountIsActive = async (input: { accId: string }) => {
  await db
    .update(accounts)
    .set({
      accIsActive: not(accounts.accIsActive),
    })
    .where(eq(accounts.accId, input.accId));

  const updatedAcc = await db.query.accounts.findFirst({
    where: (acc) => eq(acc.accId, input.accId),
  });

  return updatedAcc;
};
