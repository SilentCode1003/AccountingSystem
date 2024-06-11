import crypto from "crypto";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import path from "path";
import * as xlsx from "xlsx";
import db from "../database";
import modesOfPayment from "../database/schema/modeOfPayment";
import { getAllAccountTypes } from "../database/services/accountType.service";
import { addBudget } from "../database/services/budgets.service";
import { getCustomerByName } from "../database/services/customers.service";
import { getEmployeeByName } from "../database/services/employees.service";
import { addLiquidation } from "../database/services/liquidations.service";
import {
  addTransaction,
  editTransaction,
  getAllTransactions,
} from "../database/services/transactions.service";
import { getVendorByName } from "../database/services/vendors.service";
import {
  createTransactionByFileValidator,
  createValidator,
  updateValidator,
} from "../utils/validators/transactions.validator";
import { addTransactionType } from "../database/services/transactionTypes.service";
import {
  addRunningBalance,
  getLastRunningBalanceForEmployee,
} from "../database/services/runningBalance.service";

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await getAllTransactions(db);
    console.log("successfully fetched all transactions");
    return res.status(200).send({ transactions });
  } catch (error) {
    console.log("error in fetching all transactions");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
export const createTransaction = async (req: Request, res: Response) => {
  const input = createValidator.safeParse({
    ...req.body,
    tranTransactionDate: new Date(req.body.tranTransactionDate).toISOString(),
    tranFile: req.files!.tranFile,
  });

  if (!input.success)
    return res
      .status(400)
      .send({ error: "Invalid inputs", message: input.error.errors });

  try {
    const newTransaction = await addTransaction(db, {
      ...input.data,
    });
    input.data.tranFile?.mv(
      path.join(
        __dirname,
        "..",
        "..",
        "files/transactionfiles",
        `${newTransaction?.tranId}.xlsx`
      )
    );
    console.log("successfully created an transaction");
    return res.status(200).send({ transaction: newTransaction });
  } catch (error) {
    console.log("error creating an transaction");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
export const updateTransaction = async (req: Request, res: Response) => {
  const input = updateValidator.safeParse({
    ...req.body,
    tranFile: req.files?.tranFile,
    tranTransactionDate: new Date(req.body.tranTransactionDate).toISOString(),
  });

  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0].message });

  try {
    const updatedTransaction = await editTransaction(db, input.data);

    input.data.tranFile?.mv(
      path.join(
        __dirname,
        "..",
        "..",
        "files/transactionfiles",
        `${input.data.tranId}.xlsx`
      )
    );

    console.log("successfully updated an transaction");
    return res.status(200).send({ transaction: updatedTransaction });
  } catch (error) {
    console.log("error updating an transaction");
    console.log(error);
    return res.status(500).send({
      error: "Server error",
    });
  }
};

export const createTransactionByFile = async (req: Request, res: Response) => {
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
    const firstWordRegex = /^([\w]+)/;

    const secondWordRegex = /[^\w]\w+/;

    const accountTypes = await getAllAccountTypes(db);

    let entryAccType: string = "";

    accountTypes.map((accType) => {
      if (
        file.name.match(secondWordRegex)![0].slice(1, file.name.length) ===
        accType.accTypeName
      ) {
        entryAccType = accType.accTypeId;
        return;
      }
    });

    const f = xlsx.read(file.data, {
      type: "buffer",
      // sheetStubs: true
    }).Sheets["Liquidation"];

    const cells = Object.keys(f);

    const excelEntries = [];
    let count = 0;
    for (let i = 0; i < cells.length; i++) {
      count++;

      const val = String(f[cells[i]].v).replaceAll(/\s/g, "");

      if (val === "RECEIVEDBY:") {
        excelEntries.push(cells.slice(i - (count - 1), i + 1));
        count = 0;
      }
    }

    type LiquidationRoute = {
      lrDestination: string;
      lrModeOfTransport: string;
      lrFrom: string;
      lrTo: string;
      lrPrice: number;
    };

    const lq: Array<{
      tranPartner?: string;
      amount?: number;
      description?: string;
      date?: Date;
      budgetRemaining?: number;
      budgetGiven?: number;
      liquidationRoutes?: Array<LiquidationRoute>;
      tranAccTypeId?: string;
      tranMopName?: string;
    }> = await Promise.all(
      excelEntries.map(async (entry) => {
        const entryObj: any = {};
        let count: number = 0;
        const routes: Array<string> = [];
        const liquidationRoutes: Array<LiquidationRoute> = [];
        for (let i = 0; i < entry.length; i++) {
          const val = String(f[entry[i]].v).replaceAll(/\s/g, "");

          const targetVal = f[entry[i + 1]];
          if (val === "ROUTE") {
            count = 1;
          }
          if (val === "REMARKS/COMMENTS:") {
            count = 0;
          }

          if (count === 1) {
            routes.push(val);
          }

          if (val === "SUBTOTAL:") {
            entryObj["amount"] = Number(targetVal.v);
          }

          if (val === "DATE:") {
            entryObj["date"] = new Date(targetVal.w);
          }

          if (val === "BUDGETRECEIVED:") {
            entryObj["budgetGiven"] = Number(targetVal.v);
          }

          if (val === "FUNDREMAINING:") {
            entryObj["budgetRemaining"] = Number(targetVal.v);
          }

          if (val === "NAME:") {
            if (file.name.toLowerCase().includes("employee")) {
              const tranPartner = await getEmployeeByName(db, targetVal.v);

              entryObj["tranPartner"] = tranPartner?.empId as string;
            } else if (file.name.includes("customer")) {
              const tranPartner = await getCustomerByName(db, targetVal.v);
              entryObj["tranPartner"] = tranPartner?.custId as string;
            } else if (file.name.includes("vendor")) {
              const tranPartner = await getVendorByName(db, targetVal.v);
              entryObj["tranPartner"] = tranPartner?.vdId as string;
            }
          }

          if (val === "MODEOFPAYMENT:") {
            entryObj["tranMopName"] = targetVal.v;
          }

          if (val === "RECEIVEDBY:") {
            entryObj["tranAccTypeId"] = entryAccType;
            entryObj["description"] = file.name.match(firstWordRegex)![0];
          }
        }

        const chunkSize = 4;
        routes.shift();
        routes.shift();
        routes.shift();

        let lrDestination = "";

        for (let i = 0; i < routes.length; i += chunkSize) {
          if (/inc-[0-9]/i.test(routes[i])) routes.shift();
          if (/st[0-9]/i.test(routes[i])) {
            lrDestination = routes[i];
            routes.shift();
          }

          const chunk = routes.slice(i, i + chunkSize);
          if (i + 1 > chunkSize && chunk.length === chunkSize)
            liquidationRoutes.push({
              lrDestination: lrDestination,
              lrFrom: chunk[0],
              lrTo: chunk[1],
              lrPrice: Number(chunk[2]),
              lrModeOfTransport: chunk[3],
            });
        }

        return { ...entryObj, liquidationRoutes };
      })
    );

    if (lq.some((l) => l.tranPartner === undefined))
      return res.status(404).send({
        error: "Transaction partner not found",
      });

    const transactionType = await db.query.tranTypes.findFirst({
      where: (tranType) =>
        eq(tranType.tranTypeName, file.name.match(firstWordRegex)![0]),
    });

    const newMultiFileName = `multiFile ${crypto.randomUUID()}`;

    const newTransactions: Array<{
      tranId: string;
      tranAccId: string;
      tranDescription: string;
      tranAmount: number;
      tranEmpId: string | null;
      tranVdId: string | null;
      tranCustId: string | null;
      tranMopId: string;
      tranTransactionDate: Date;
      tranOtherPartner: string | null;
      tranCreatedAt: Date;
      tranUpdatedAt: Date;
      tranFile: string;
      tranTypeId: string | null;
    }> = [];

    await db.transaction(async (tx) => {
      await addTransactionType(tx, {
        tranTypeName: "BUDGET",
        tranTypeAccTypeId: transactionType!.tranTypeAccTypeId,
      });

      for (const tran of lq) {
        const tranMop = await tx.query.modesOfPayment.findFirst({
          where: eq(modesOfPayment.mopName, tran.tranMopName!),
        });

        const transaction = await addTransaction(tx, {
          tranAccTypeId: tran.tranAccTypeId as string,
          tranAmount: tran.amount!,
          tranDescription: tran.description ?? "FILE TRANSACTION",
          tranTransactionDate: tran.date!,
          tranPartner: tran.tranPartner,
          tranTypeId: transactionType?.tranTypeId as string,
          tranFileName: newMultiFileName,
          tranMopId: tranMop?.mopId as string,
        });

        // budgetRemaining < amount || budgetGiven then create a new budget
        if (tran.budgetGiven && tran.budgetGiven > 0) {
          const budgetTranType = await tx.query.tranTypes.findFirst({
            where: (tranType) => eq(tranType.tranTypeName, "BUDGET"),
          });

          const budgetTransaction = await addTransaction(tx, {
            tranAccTypeId: tran.tranAccTypeId!,
            tranAmount: tran.budgetGiven!,
            tranDescription: "BUDGET" ?? "FILE TRANSACTION",
            tranTransactionDate: tran.date!,
            tranPartner: tran.tranPartner,
            tranTypeId: budgetTranType!.tranTypeId,
            tranFileName: newMultiFileName,
            tranMopId: tranMop!.mopId,
          });
          await addBudget(tx, {
            budgetEmpId: tran.tranPartner!,
            budgetAmount: tran.budgetGiven!,
            budgetDate: tran.date!,
            budgetTranId: budgetTransaction!.tranId,
          });
          newTransactions.push(budgetTransaction!);
        }

        // create a new liquidation
        const newLiq = await addLiquidation(tx, {
          liquidationEmpId: tran.tranPartner!,
          liquidationAmount: tran.amount!,
          liquidationDate: tran.date!,
          liquidationTranId: transaction!.tranId,
          liquidationRoutes: tran.liquidationRoutes!,
        });

        const lastRb = await getLastRunningBalanceForEmployee(
          tx,
          tran.tranPartner!
        );

        if (!lastRb) {
          const rbReimbursementAmount = tran.budgetGiven! - tran.amount!;

          const rbReturnAmount =
            rbReimbursementAmount > 0 ? rbReimbursementAmount : 0;

          await addRunningBalance(tx, {
            rbEmpId: tran.tranPartner!,
            rbDate: tran.date!,
            rbBudget: tran.budgetGiven!,
            rbLiqId: newLiq?.liquidationId!,
            rbReimbursementAmount,
            rbReturnAmount,
          });
        } else {
          const rbBudget = Number(lastRb!.rbReturnAmount) + tran.budgetGiven!;

          const rbReimbursementAmount =
            rbBudget -
            (tran.amount! -
              (Number(lastRb.rbReimbursementAmount) < 0
                ? Number(lastRb.rbReimbursementAmount)
                : 0));

          const rbReturnAmount =
            rbReimbursementAmount > 0 ? rbReimbursementAmount : 0;
          await addRunningBalance(tx, {
            rbEmpId: tran.tranPartner!,
            rbDate: tran.date!,
            rbBudget,
            rbLiqId: newLiq?.liquidationId!,
            rbReimbursementAmount,
            rbReturnAmount,
          });
        }

        newTransactions.push(transaction!);
      }
    });

    file.mv(
      path.join(
        __dirname,
        "..",
        "..",
        "files/transactionfiles",
        `${newMultiFileName}.xlsx`
      )
    );

    console.log("successfully created transaction by file");
    return res.send({ transactions: newTransactions });
  } catch (error) {
    console.log("error creating transaction by file");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
