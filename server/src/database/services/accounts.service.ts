import db from "../index";
import accounts from "../schema/accounts.schema";
import { eq, not } from "drizzle-orm";

export const getAllAccounts = async () => {
  const accounts = await db.query.accounts.findMany({
    with: { accountType: true },
  });

  return accounts;
};

export const getAccountByID = async (accId: string) => {
  const account = await db.query.accounts.findFirst({
    where: (account) => eq(account.accId, accId),
    with: {
      accountType: true,
    },
  });

  return account;
};

export const addAccount = async (input: {
  accTypeId: string;
  accDescription: string;
  accAmount: number;
}) => {
  const newAccountId = `accId ${crypto.randomUUID()}`;

  await db.insert(accounts).values({ ...input, accId: newAccountId });

  const newAccount = await db.query.accounts.findFirst({
    where: (account) => eq(account.accId, newAccountId),
    with: {
      accountType: true,
    },
  });

  return newAccount;
};

export const editAccount = async (input: {
  accId: string;
  newData: {
    accTypeId?: string;
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
    with: {
      accountType: true,
    },
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
    with: {
      accountType: true,
    },
  });

  return updatedAcc;
};
