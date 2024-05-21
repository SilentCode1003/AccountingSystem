import { sql, sum } from "drizzle-orm";
import db from "../index";
import accounts from "../schema/accounts.schema";
import crypto from "crypto";
import { eq, not } from "drizzle-orm";
import { and } from "drizzle-orm";
import accountTypes from "../schema/accountType.schema";

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

export const getBalanceSheet = async (month: Date, accTypes: string[]) => {
  const accountsByMonth = Promise.all(
    accTypes.map(async (accTypeId) => {
      const accType = await db.query.accountTypes.findFirst({
        where: eq(accountTypes.accTypeId, accTypeId),
      });

      const accs = await db
        .select({
          accName: accounts.accName,
          amount: sum(accounts.accAmount),
        })
        .from(accounts)
        .where(
          and(
            eq(accounts.accTypeId, accTypeId),
            sql`month(acc_created_at) = month(${month})`,
            sql`year(acc_created_at) = year(${month})`
          )
        )
        .groupBy(accounts.accName, sql`monthname(acc_created_at)`);

      return {
        ...accType,
        accounts: accs,
      };
    })
  );

  return accountsByMonth;
};

export const getIncomeStatement = async (month: Date, accTypes: string[]) => {
  const accountsByMonth = Promise.all(
    accTypes.map(async (accTypeId) => {
      const accType = await db.query.accountTypes.findFirst({
        where: eq(accountTypes.accTypeId, accTypeId),
      });

      const accs = await db
        .select({
          accName: accounts.accName,
          amount: sum(accounts.accAmount),
        })
        .from(accounts)
        .where(
          and(
            eq(accounts.accTypeId, accTypeId),
            sql`month(acc_created_at) = month(${month})`,
            sql`year(acc_created_at) = year(${month})`
          )
        )
        .groupBy(accounts.accName, sql`monthname(acc_created_at)`);

      return {
        ...accType,
        accounts: accs,
      };
    })
  );

  return accountsByMonth;
};

export const addAccount = async (input: {
  accName: string;
  accTypeId: string;
  accDescription: string;
  accAmount: number;
  accCreatedAt?: Date;
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
    accName?: string;
    accTypeId?: string;
    accDescription?: string;
    accAmount?: number;
    accCreatedAt?: Date;
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
