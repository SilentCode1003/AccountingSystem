import { Router } from "express";

import {
  createTransactionType,
  getTransactionTypes,
  updateTransactionType,
} from "../controller/transactionTypes.controller";

const transactionTypesRouter = Router();

//get all transactionTypes
transactionTypesRouter.get("/", getTransactionTypes);

//create a transaction entry
transactionTypesRouter.post("/", createTransactionType);

//update a transaction
transactionTypesRouter.put("/", updateTransactionType);

export default transactionTypesRouter;
