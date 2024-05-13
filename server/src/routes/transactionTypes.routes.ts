import { Router } from "express";

import {
  createTransactionType,
  deleteTransactionType,
  getTransactionTypes,
  updateTransactionType,
} from "../controller/transactionTypes.controller";

const transactionTypesRouter = Router();

//get all transactionTypes
transactionTypesRouter.get("/", getTransactionTypes);

//create a transaction type
transactionTypesRouter.post("/", createTransactionType);

//update a transaction type
transactionTypesRouter.put("/", updateTransactionType);

//delete a transaction type
transactionTypesRouter.delete("/:tranTypeId", deleteTransactionType);

export default transactionTypesRouter;
