import crypto from "crypto";
import { and, eq, not, sql, sum } from "drizzle-orm";
import { DB } from "..";
import accounts from "../schema/accounts.schema";
import accountTypes from "../schema/accountType.schema";

const ACCTYPE_DEFAULT = {
  CASHFLOW: "CASHFLOW",
  BALANCESHEET: "BALANCESHEET",
  INCOMESTATEMENT: "INCOMESTATEMENT",
} as const;

type ObjectTypes<T> = T[keyof T];

type AccountTypeDefault = ObjectTypes<typeof ACCTYPE_DEFAULT>;

export const getAllAccountTypes = async (db: DB) => {
  const accountTypes = await db.query.accountTypes.findMany({
    with: {
      accounts: true,
      transactionTypes: true,
    },
  });
  return accountTypes;
};

export const getAccountTypeById = async (
  db: DB,
  input: { accTypeId: string }
) => {
  const accountType = await db.query.accountTypes.findFirst({
    where: (accType) => eq(accType.accTypeId, input.accTypeId),
    with: {
      accounts: true,
      transactionTypes: true,
    },
  });
  return accountType;
};

export const addAccountType = async (
  db: DB,
  input: {
    accTypeName: string;
    accTypeDefault: AccountTypeDefault;
  }
) => {
  const newAccountTypeId = `accTypeId ${crypto.randomUUID()}`;
  await db.insert(accountTypes).values({
    accTypeId: newAccountTypeId,
    accTypeName: input.accTypeName,
    accTypeDefault: input.accTypeDefault,
  });

  const newAccountType = await getAccountTypeById(db, {
    accTypeId: newAccountTypeId,
  });
  return newAccountType;
};

export const editAccountType = async (
  db: DB,
  input: {
    accTypeId: string;
    newData: {
      accTypeName?: string;
      accTypeDefault?: AccountTypeDefault;
    };
  }
) => {
  await db
    .update(accountTypes)
    .set(input.newData)
    .where(eq(accountTypes.accTypeId, input.accTypeId));
  const updatedAccountType = await getAccountTypeById(db, {
    accTypeId: input.accTypeId,
  });

  return updatedAccountType;
};

export const changeAccountTypeIsActive = async (
  db: DB,
  input: {
    accTypeId: string;
  }
) => {
  await db
    .update(accountTypes)
    .set({
      accTypeIsActive: not(accountTypes.accTypeIsActive),
    })
    .where(eq(accountTypes.accTypeId, input.accTypeId));
  const editedAccountType = await getAccountTypeById(db, input);
  return editedAccountType;
};
export const getAccountTypeTotalPerMonthQuery = async (
  db: DB,
  input: {
    accTypeId: string;
    date: Date;
  }
) => {
  const data = await db
    .select({
      total: sum(accounts.accAmount),
    })
    .from(accounts)
    .where(
      and(
        eq(sql`month(acc_created_at)`, sql`month(${input.date})`),
        eq(sql`year(acc_created_at)`, sql`year(${input.date})`),
        eq(accounts.accTypeId, input.accTypeId),
        eq(accounts.accIsActive, true)
      )
    );
  return data[0].total;
};

export const getAccountTypeBarChartData = async (
  db: DB,
  input: {
    accTypeId: string;
  }
) => {
  const currentMonth = new Date().getMonth();

  let data: Array<any> = [];
  let aKeys: Array<any> = [];
  for (let i = 0; i < currentMonth + 1; i++) {
    const d = await db
      .select({
        accTypeId: accounts.accTypeId,
        name: accounts.accName,
        total: sum(accounts.accAmount),
      })
      .from(accounts)
      .where(
        and(
          eq(
            sql`month(acc_created_at)`,
            sql`month(${new Date(new Date().getFullYear(), i)})`
          ),
          eq(
            sql`year(acc_created_at)`,
            sql`year(${new Date(new Date().getFullYear(), i)})`
          ),
          eq(accounts.accTypeId, input.accTypeId)
          // eq(accounts.accIsActive, true)
        )
      )
      .groupBy(accounts.accName);

    const dz: any = {};

    d.map((item) => {
      dz[item.name] = parseFloat(String(item.total));
      aKeys.push(item.name);
    });

    data.push({
      name: new Date(new Date().getFullYear(), i).toLocaleString("default", {
        month: "long",
      }),
      ...dz,
      total: d.reduce((acc, curr) => acc + parseFloat(String(curr.total)), 0),
    });
  }

  return {
    keys: Array.from(new Set(aKeys)),
    data,
  };
};
