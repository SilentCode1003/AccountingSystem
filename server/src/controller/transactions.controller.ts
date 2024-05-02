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

export const createTransactionByFile = (req: Request, res: Response) => {
  const file = req.files!.file as UploadedFile;

  const f = xlsx.read(file.data, { type: "buffer" }).Sheets["Liquidation"];

  const cells = Object.keys(f);

  const lq: {
    name: string;
    amount: number;
    description: string;
    date: Date;
  } = {
    name: "",
    amount: 0,
    description: "",
    date: new Date(),
  };

  for (let i = 0; i < cells.length; i++) {
    if (f[cells[i]].v === "SUB TOTAL:") {
      lq["amount"] = f[cells[i + 1]].v;
    }

    if (f[cells[i]].v === "DATE :") {
      lq["date"] = new Date(f[cells[i + 1]].w);
    }

    if (f[cells[i]].v === "NAME :") {
      lq["name"] = f[cells[i + 1]].v;
    }
  }

  return res.send({ lq });
};
