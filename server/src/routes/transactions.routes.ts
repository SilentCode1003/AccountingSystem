import { Router } from "express";
import {
  createTransaction,
  createTransactionByFile,
  getTransactions,
  updateTransaction,
} from "../controller/transactions.controller";

const transactionRouter = Router();

//get all transaction
transactionRouter.get("/", getTransactions);

//create an transaction entry
transactionRouter.post("/", createTransaction);

//create a transaction entry with excel file
transactionRouter.post("/file", createTransactionByFile);

//update an transaction
transactionRouter.put("/", updateTransaction);

export default transactionRouter;
