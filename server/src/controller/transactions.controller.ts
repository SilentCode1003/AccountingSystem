import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import path from "path";
import * as xlsx from "xlsx";
import db from "../database";
import { getAllAccountTypes } from "../database/services/accountType.service";
import { getCustomerByName } from "../database/services/customers.service";
import { getEmployeeByName } from "../database/services/employees.service";
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
import crypto from "crypto";

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await getAllTransactions();
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
    const newTransaction = await addTransaction({
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
    const updatedTransaction = await editTransaction(input.data);

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

    const accountTypes = await getAllAccountTypes();

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

    const f = xlsx.read(file.data, { type: "buffer" }).Sheets["Liquidation"];

    const cells = Object.keys(f);

    const excelEntries = [];
    let count = 0;
    for (let i = 0; i < cells.length; i++) {
      count++;

      if (f[cells[i]].v === "RECEIVED BY :") {
        excelEntries.push(cells.slice(i - (count - 1), i + 1));
        count = 0;
      }
    }

    const lq: Array<{
      tranPartner?: string;
      amount?: number;
      description?: string;
      date?: Date;
      tranAccTypeId?: string;
    }> = await Promise.all(
      excelEntries.map(async (entry) => {
        const entryObj: any = {};
        for (let i = 0; i < entry.length; i++) {
          if (f[entry[i]].v === "SUB TOTAL:") {
            entryObj["amount"] = Number(f[entry[i + 1]].v);
          }

          if (f[entry[i]].v === "DATE :") {
            entryObj["date"] = new Date(f[entry[i + 1]].w);
          }

          if (f[entry[i]].v === "NAME :") {
            if (file.name.toLowerCase().includes("employee")) {
              const tranPartner = await getEmployeeByName(f[entry[i + 1]].v);

              entryObj["tranPartner"] = (tranPartner?.empId as string) ?? "xdd";
            } else if (file.name.includes("customer")) {
              const tranPartner = await getCustomerByName(f[entry[i + 1]].v);
              entryObj["tranPartner"] = tranPartner?.custId as string;
            } else if (file.name.includes("vendor")) {
              const tranPartner = await getVendorByName(f[entry[i + 1]].v);
              entryObj["tranPartner"] = tranPartner?.vdId as string;
            }
          }
          if (f[entry[i]].v === "RECEIVED BY :") {
            entryObj["tranAccTypeId"] = entryAccType;
            entryObj["description"] = file.name.match(firstWordRegex)![0];
          }
        }
        return entryObj;
      })
    );

    const transactionType = await db.query.tranTypes.findFirst({
      where: (tranType) =>
        eq(tranType.tranTypeName, file.name.match(firstWordRegex)![0]),
    });

    const newMultiFileName = `multiFile ${crypto.randomUUID()}`;

    const transactions = await Promise.all(
      lq.map(async (tran) => {
        const transaction = await addTransaction({
          tranAccTypeId: tran.tranAccTypeId as string,
          tranAmount: tran.amount!,
          tranDescription: tran.description ?? "FILE TRANSACTION",
          tranTransactionDate: tran.date!,
          tranPartner: tran.tranPartner,
          tranTypeId: transactionType?.tranTypeId as string,
          tranFileName: newMultiFileName,
        });

        return transaction;
      })
    );

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
    return res.send({ transactions });
  } catch (error) {
    console.log("error creating transaction by file");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
