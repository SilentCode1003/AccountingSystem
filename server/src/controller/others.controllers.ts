import { and, eq, inArray, sql, sum } from "drizzle-orm";
import { Request, Response } from "express";
import db from "../database";
import accounts from "../database/schema/accounts.schema";
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
import path from "path";
import employees from "../database/schema/employees.schema";
import { createTransactionByFileValidator } from "../utils/validators/transactions.validator";
import * as xlsx from "xlsx";

export const getTransactionPartners = async (req: Request, res: Response) => {
  try {
    const employees = await getAllEmployees();
    const customers = await getAllCustomers();
    const vendors = await getAllVendors();

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
    const accTypeName = await getAccountTypeById({
      accTypeId: input.data.accTypeId,
    });

    const total = await getAccountTypeTotalPerMonthQuery({
      accTypeId: input.data.accTypeId,
      date: input.data.date,
    });

    const prevMonthTotal = await getAccountTypeTotalPerMonthQuery({
      accTypeId: input.data.accTypeId,
      date: new Date(
        input.data.date.getFullYear(),
        input.data.date.getMonth() - 1
      ),
    });

    console.log(
      "successfully fetched account type total for given month and year"
    );
    return res.status(200).send({
      accountTypeName: accTypeName!.accTypeName,
      total,
      percentAgainstPrevMonth:
        Number(total) > Number(prevMonthTotal)
          ? (parseFloat(String(prevMonthTotal ?? 0)) /
              parseFloat(String(total ?? 0))) *
            100
          : -(
              (parseFloat(String(prevMonthTotal ?? 0)) /
                parseFloat(String(total ?? 0))) *
              100
            ),
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
    const data = await getAccountTypeBarChartData(input.data);
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
            )
          )
        )
        .groupBy(accounts.accTypeId);

      const dz: any = {};

      await Promise.all(
        d.map(async (item) => {
          const accTypeName = await db.query.accountTypes.findFirst({
            where: eq(accounts.accTypeId, item.accTypeId),
          });

          dz[accTypeName!.accTypeName] = parseFloat(String(item.total));
          aKeys.push(accTypeName?.accTypeName);
        })
      );

      data.push({
        name: new Date(new Date().getFullYear(), i).toLocaleString("default", {
          month: "long",
        }),
        ...dz,
        total: d.reduce((acc, curr) => acc + parseFloat(String(curr.total)), 0),
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
  const filePath = path.join(
    __dirname,
    "..",
    "..",
    `/files/transactionfiles/${fileName}`
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
            newEmployeeId: string;
            firstname: string;
            phone: string;
            email: string;
            jobstatus: string;
            me_department: string;
            me_position: string;
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
      empId: emp.newEmployeeId,
      empName: emp.firstname,
      empContactInfo: emp.phone,
      empEmail: emp.email,
      empJobStatus: emp.jobstatus,
      empDepartment: emp.me_department,
      empPosition: emp.me_position,
    }));

    await Promise.all(
      shapeDataToDB.map(async (emp) => {
        //check if employee exists
        const empExists = await db.query.employees.findFirst({
          where: eq(employees.empId, `empId ${emp.empId}`),
        });

        //early return if employee does not exist
        if (!empExists) return;

        //insert employee
        const newEmployee = await db.insert(employees).values({
          ...emp,
          empId: `empId ${emp.empId}`,
          empDateHired: new Date(),
        });

        return newEmployee;
      })
    );

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

    await Promise.all(
      shapeDataToDB.map(async (emp) => {
        //check if employee exists
        const empExists = await db.query.employees.findFirst({
          where: eq(employees.empId, `empId ${emp.empId}`),
        });

        //early return if employee does not exist
        if (empExists) return;

        //insert employee
        const newEmployee = await db.insert(employees).values({
          ...emp,
          empId: `empId ${emp.empId}`,
          empDateHired: new Date(),
        });

        return newEmployee;
      })
    );

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
