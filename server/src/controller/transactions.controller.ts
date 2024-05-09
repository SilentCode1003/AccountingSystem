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
    const lq: {
      tranPartner: string;
      amount: number;
      description: string;
      date: Date;
      tranAccTypeId?: string;
    } = {
      tranPartner: "",
      amount: 0,
      description: "",
      date: new Date(),
    };

    const accountTypes = await getAllAccountTypes();

    accountTypes.map((accType) => {
      if (file.name.startsWith(accType.accTypeName)) {
        lq["tranAccTypeId"] = accType.accTypeId;
        return;
      }
    });

    const f = xlsx.read(file.data, { type: "buffer" }).Sheets["Liquidation"];

    const cells = Object.keys(f);

    for (let i = 0; i < cells.length; i++) {
      if (f[cells[i]].v === "SUB TOTAL:") {
        lq["amount"] = f[cells[i + 1]].v;
      }

      if (f[cells[i]].v === "DATE :") {
        lq["date"] = new Date(f[cells[i + 1]].w);
      }

      if (f[cells[i]].v === "NAME :") {
        if (file.name.toLowerCase().includes("employee")) {
          const tranPartner = await getEmployeeByName(f[cells[i + 1]].v);

          lq["tranPartner"] = tranPartner?.empId as string;
        } else if (file.name.includes("customer")) {
          const tranPartner = await getCustomerByName(f[cells[i + 1]].v);
          lq["tranPartner"] = tranPartner?.custId as string;
        } else if (file.name.includes("vendor")) {
          const tranPartner = await getVendorByName(f[cells[i + 1]].v);
          lq["tranPartner"] = tranPartner?.vdId as string;
        }
      }
    }

    const transactionType = await db.query.tranTypes.findFirst({
      where: (tranType) => eq(tranType.tranTypeName, "LIQUIDATION"),
    });

    const transaction = await addTransaction({
      tranAccTypeId: lq.tranAccTypeId as string,
      tranAmount: lq.amount,
      tranDescription: lq.description,
      tranTransactionDate: lq.date,
      tranPartner: lq.tranPartner,
      tranTypeId: transactionType?.tranTypeId as string,
    });

    file.mv(
      path.join(
        __dirname,
        "..",
        "..",
        "files/transactionfiles",
        `${transaction?.tranId}.xlsx`
      )
    );
    console.log("successfully created an transaction by file");
    return res.send({ transaction });
  } catch (error) {
    console.log("error creating an transaction by file");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
