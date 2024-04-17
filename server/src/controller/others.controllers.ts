import { Request, Response } from "express";
import { getAllEmployees } from "../database/services/employees.service";
import { getAllCustomers } from "../database/services/customers.service";
import { getAllVendors } from "../database/services/vendors.service";
import db from "../database";
import { sum, eq, sql } from "drizzle-orm";
import accounts from "../database/schema/accounts.schema";
import {
  AccountTotalValidator,
  IncomeStatementByMonthValidator,
} from "../utils/validators/others.validator";
import { and } from "drizzle-orm";
import { getIncomeStatement } from "../database/services/accounts.service";

export const getTransactionPartners = async (req: Request, res: Response) => {
  try {
    const employees = await getAllEmployees();
    const customers = await getAllCustomers();
    const vendors = await getAllVendors();

    return res.status(200).send({
      employees,
      customers,
      vendors,
    });
  } catch (error) {
    return res.status(500).send({
      error: "Server error",
    });
  }
};

export const getAccountTotal = async (req: Request, res: Response) => {
  const input = AccountTotalValidator.safeParse(req.body);

  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0].message });

  try {
    const account = await db
      .select({
        description: accounts.accDescription,
        total: sum(accounts.accAmount),
      })
      .from(accounts)
      .where(
        and(
          eq(accounts.accTypeId, "EXPENSE"),
          sql`month(acc_created_at) = month(${input.data.accCreatedAt})`,
          sql`year(acc_created_at) = year(${input.data.accCreatedAt})`
        )
      )
      .groupBy(accounts.accDescription, sql`monthname(acc_created_at)`);

    return res.status(200).send({
      data: account,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error: "Server error",
    });
  }
};

export const getIncomeStatementByMonth = async (
  req: Request,
  res: Response
) => {
  const input = IncomeStatementByMonthValidator.safeParse({
    month: new Date(req.query.month as string),
    accTypes: req.query.accTypes,
  });

  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0].message });

  const accountByMonth = await getIncomeStatement(
    input.data.month as Date,
    input.data.accTypes
      ? typeof input.data.accTypes === "string"
        ? [input.data.accTypes]
        : input.data.accTypes
      : []
  );

  return res.send(accountByMonth);
};
