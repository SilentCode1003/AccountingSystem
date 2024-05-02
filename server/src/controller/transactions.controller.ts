import { Request, Response } from "express";
import {
  addTransaction,
  editTransaction,
  getAllTransactions,
} from "../database/services/transactions.service";
import {
  createValidator,
  updateValidator,
} from "../utils/validators/transactions.validator";
import { UploadedFile } from "express-fileupload";
import * as xlsx from "xlsx";
import { getAllAccountTypes } from "../database/services/accountType.service";
import { getEmployeeByName } from "../database/services/employees.service";
import { getCustomerByName } from "../database/services/customers.service";
import { getVendorByName } from "../database/services/vendors.service";

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await getAllTransactions();

    return res.status(200).send({ transactions });
  } catch (error) {
    return res.status(500).send({ error: "Server error" });
  }
};
export const createTransaction = async (req: Request, res: Response) => {
  const input = createValidator.safeParse(req.body);

  if (!input.success)
    return res
      .status(400)
      .send({ error: "Invalid inputs", message: input.error.errors });

  try {
    const newTransaction = await addTransaction(input.data);
    return res.status(200).send({ transaction: newTransaction });
  } catch (error) {
    return res.status(500).send({ error: "Server error" });
  }
};
export const updateTransaction = async (req: Request, res: Response) => {
  const input = updateValidator.safeParse(req.body);

  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0].message });

  try {
    const updatedTransaction = await editTransaction(input.data);
    return res.status(200).send({ transaction: updatedTransaction });
  } catch (error) {
    return res.status(500).send({
      error: "Server error",
    });
  }
};

export const createTransactionByFile = async (req: Request, res: Response) => {
  if (!req.files?.file)
    return res.status(400).send({ error: "No file uploaded" });
  const file = req.files!.file as UploadedFile;
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

  const transaction = await addTransaction({
    tranAccTypeId: lq.tranAccTypeId as string,
    tranAmount: lq.amount,
    tranDescription: lq.description,
    tranTransactionDate: lq.date,
    tranPartner: lq.tranPartner,
  });

  return res.send({ transaction });
};
