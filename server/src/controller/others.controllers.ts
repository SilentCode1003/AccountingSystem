import { Request, Response } from "express";
import { getAllEmployees } from "../database/services/employees.service";
import { getAllCustomers } from "../database/services/customers.service";
import { getAllVendors } from "../database/services/vendors.service";
import db from "../database";
import { sum, eq, sql } from "drizzle-orm";
import accounts from "../database/schema/accounts.schema";
import { AccountTotalValidator } from "../utils/validators/others.validator";
import { and } from "drizzle-orm";

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
          eq(accounts.accType, "EXPENSE"),
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
