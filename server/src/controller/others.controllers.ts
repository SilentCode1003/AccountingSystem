import { and, eq, sql, sum } from "drizzle-orm";
import { Request, Response } from "express";
import path from "path";
import * as xlsx from "xlsx";
import accounts from "../database/schema/accounts.schema";
import employees from "../database/schema/employees.schema";
import {
  getBalanceSheet,
  getIncomeStatement,
} from "../database/services/accounts.service";
import {
  getAccountTypeBarChartData,
  getAccountTypeById,
  getAccountTypeTotalPerMonthQuery,
} from "../database/services/accountType.service";
import { getAllCustomers } from "../database/services/customers.service";
import { getAllEmployees } from "../database/services/employees.service";
import { getAllVendors } from "../database/services/vendors.service";
import {
  AccountTotalValidator,
  accounTypeIdValidator,
  getAccountTypeTotalPerMonthValidator,
  IncomeStatementByMonthValidator,
  syncEmployeesByAPIValidator,
} from "../utils/validators/others.validator";
import { createTransactionByFileValidator } from "../utils/validators/transactions.validator";
import fetch from "node-fetch";
import db from "../database";

export const getTransactionPartners = async (req: Request, res: Response) => {
  try {
    const employees = await getAllEmployees(db);
    const customers = await getAllCustomers(db);
    const vendors = await getAllVendors(db);

    console.log("successfully fetched all transaction partners");
    return res.status(200).send({
      employees,
      customers,
      vendors,
    });
  } catch (error) {
    console.log("error in fetching all transaction partners");
    console.log(error);
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

    console.log("successfully fetched account total for given month and year");
    return res.status(200).send({
      data: account,
    });
  } catch (error) {
    console.log("error in fetching account total for given month and year");
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

  try {
    const accountByMonth = await getIncomeStatement(
      db,
      input.data.month as Date,
      input.data.accTypes
        ? typeof input.data.accTypes === "string"
          ? [input.data.accTypes]
          : input.data.accTypes
        : []
    );

    console.log(
      "successfully fetched income statement for given month and year"
    );
    return res.send(accountByMonth);
  } catch (error) {
    console.log("error in fetching income statement for given month and year");
    console.log(error);
    return res.status(500).send({
      error: "Server error",
    });
  }
};

export const getBalanceSheetByMonth = async (req: Request, res: Response) => {
  const input = IncomeStatementByMonthValidator.safeParse({
    month: new Date(req.query.month as string),
    accTypes: req.query.accTypes,
  });

  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0].message });
  try {
    const accountByMonth = await getBalanceSheet(
      db,
      input.data.month as Date,
      input.data.accTypes
        ? typeof input.data.accTypes === "string"
          ? [input.data.accTypes]
          : input.data.accTypes
        : []
    );
    console.log("successfully fetched balance sheet for given month and year");
    return res.send(accountByMonth);
  } catch (error) {
    console.log("error in fetching balance sheet for given month and year");
    console.log(error);
    return res.status(500).send({
      error: "Server error",
    });
  }
};

export const getAccountTypeTotalPerMonth = async (
  req: Request,
  res: Response
) => {
  const input = getAccountTypeTotalPerMonthValidator.safeParse({
    date: new Date(req.query.date as string),
    accTypeId: req.query.accTypeId,
  });

  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0].message });

  try {
    const accTypeName = await getAccountTypeById(db, {
      accTypeId: input.data.accTypeId,
    });

    const total = await getAccountTypeTotalPerMonthQuery(db, {
      accTypeId: input.data.accTypeId,
      date: input.data.date,
    });

    const prevMonthTotal = await getAccountTypeTotalPerMonthQuery(db, {
      accTypeId: input.data.accTypeId,
      date: new Date(
        input.data.date.getFullYear(),
        input.data.date.getMonth() - 1
      ),
    });

    const currTotal = parseFloat(String(total ?? 0));
    const prevTotal = parseFloat(String(prevMonthTotal ?? 0));
    const percentTotal = Math.abs((prevTotal - currTotal) / prevTotal) * 100;
    const finalPercent = prevTotal > currTotal ? -percentTotal : percentTotal;

    console.log(
      "successfully fetched account type total for given month and year"
    );

    return res.status(200).send({
      accountTypeName: accTypeName!.accTypeName,
      total,
      percentAgainstPrevMonth:
        Number.isNaN(finalPercent) || !Number.isFinite(finalPercent)
          ? 0
          : finalPercent,
    });
  } catch (error) {
    console.log(
      "error in fetching account type total for given month and year"
    );
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};

export const AccountTypeBarChartData = async (req: Request, res: Response) => {
  const input = accounTypeIdValidator.safeParse(req.query);

  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0].message });

  try {
    const data = await getAccountTypeBarChartData(db, input.data);
    console.log("successfully fetched account type bar chart data");
    return res.status(200).send({
      data,
    });
  } catch (error) {
    console.log("error in fetching account type bar chart data");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};

export const getBarChartCashFlowData = async (req: Request, res: Response) => {
  try {
    const currentMonth = new Date().getMonth();

    let data: Array<any> = [];
    let aKeys: Array<any> = [];

    for (let i = 0; i < currentMonth + 1; i++) {
      const d = await db
        .select({
          total: sum(accounts.accAmount),
          accTypeId: accounts.accTypeId,
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
            eq(accounts.accIsActive, true)
          )
        )
        .groupBy(accounts.accTypeId);

      const dz: any = {};

      const nd = await Promise.all(
        d.map(async (item) => {
          const accTypeName = await db.query.accountTypes.findFirst({
            where: eq(accounts.accTypeId, item.accTypeId),
          });

          dz[accTypeName!.accTypeName] = parseFloat(String(item.total));
          aKeys.push(accTypeName?.accTypeName);

          return {
            total: item.total,
            isProfit: accTypeName!.accTypeIsProfit,
          };
        })
      );

      data.push({
        name: new Date(new Date().getFullYear(), i).toLocaleString("default", {
          month: "long",
        }),
        ...dz,
        total: nd.reduce(
          (acc, curr) =>
            acc +
            (curr.isProfit
              ? parseFloat(String(curr.total))
              : -parseFloat(String(curr.total))),
          0
        ),
      });
    }

    console.log("successfully fetched bar chart cash flow data");
    return res.send({
      dataKeys: Array.from(new Set(aKeys)),
      data,
    });
  } catch (error) {
    console.log("error in fetching bar chart cash flow data");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};

export const downloadFile = async (req: Request, res: Response) => {
  const fileName = req.query.fileName as string;
  const dirPath = req.query.dirPath as string;
  const filePath = path.join(
    __dirname,
    "..",
    "..",
    `/files/${dirPath}/${fileName}`
  );

  res.download(filePath);
};

export const syncEmployeesByAPI = async (req: Request, res: Response) => {
  const input = syncEmployeesByAPIValidator.safeParse(req.query);

  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0].message });

  try {
    const data = await fetch(input.data.employeeApi).then(
      (res) =>
        res.json() as Promise<{
          msg: string;
          data: Array<{
            id: string;
            fullname: string;
            phone: string;
            email: string;
            jobstatus: string;
            departmentname: string;
            positionname: string;
          }>;
        }>
    );

    const shapeDataToDB: Array<{
      empId: string;
      empName: string;
      empContactInfo: string;
      empEmail: string;
      empJobStatus: string;
      empDepartment: string;
      empPosition: string;
    }> = data.data.map((emp) => ({
      empId: emp.id,
      empName: emp.fullname,
      empContactInfo: emp.phone,
      empEmail: emp.email,
      empJobStatus: emp.jobstatus,
      empDepartment: emp.departmentname,
      empPosition: emp.positionname,
    }));

    for (const emp of shapeDataToDB) {
      //check if employee exists
      const empExists = await db.query.employees.findFirst({
        where: eq(employees.empId, `empId ${emp.empId}`),
      });

      //early return if employee does not exist
      if (empExists) continue;

      //insert employee
      await db.insert(employees).values({
        ...emp,
        empId: `empId ${emp.empId}`,
        empDateHired: new Date(),
      });
    }

    //query all synced employees
    const syncedEmployees = await db.query.employees.findMany();

    //return synced employees
    return res.status(200).send({ syncedEmployees });
  } catch (error) {
    console.log("error in syncing employees");
    console.log(error);

    return res.status(500).send({ error: "Server error" });
  }
};

export const syncEmployeesByFile = async (req: Request, res: Response) => {
  if (!req.files?.file)
    return res.status(400).send({ error: "No file uploaded" });

  const validateFile = createTransactionByFileValidator.safeParse({
    tranFile: req.files!.file,
  });

  if (!validateFile.success)
    return res
      .status(400)
      .send({ error: validateFile.error.errors[0].message });
  try {
    const file = validateFile.data.tranFile;

    const f = xlsx.read(file.data, { type: "buffer" }).Sheets["Sheet1"];

    const shapeDataToDB: Array<{
      empId: string;
      empName: string;
      empContactInfo: string;
      empEmail: string;
      empJobStatus: string;
      empDepartment: string;
      empPosition: string;
    }> = xlsx.utils.sheet_to_json(f, {
      header: [
        "empId",
        "empName",
        "empContactInfo",
        "empEmail",
        "empJobStatus",
        "empDepartment",
        "empPosition",
      ],
    });

    shapeDataToDB.shift();
    console.log(shapeDataToDB);

    for (const emp of shapeDataToDB) {
      //check if employee exists
      const empExists = await db.query.employees.findFirst({
        where: eq(employees.empId, `empId ${emp.empId}`),
      });

      //early return if employee does not exist
      if (empExists) continue;

      //insert employee
      await db.insert(employees).values({
        ...emp,
        empId: `empId ${emp.empId}`,
        empDateHired: new Date(),
      });
    }

    //query all synced employees
    const syncedEmployees = await db.query.employees.findMany();

    //return synced employees
    return res.status(200).send({ syncedEmployees });
  } catch (error) {
    console.log("error creating transaction by file");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
