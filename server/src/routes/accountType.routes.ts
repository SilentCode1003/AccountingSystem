import { Router } from "express";
import {
  createAccountType,
  getAccountTypes,
  updateAccountType,
} from "../controller/accountTypes.controller";

const accountTypeRouter = Router();

//get all accountTypes
accountTypeRouter.get("/", getAccountTypes);

//create an accountType entry
accountTypeRouter.post("/", createAccountType);

//update an accountType
accountTypeRouter.put("/", updateAccountType);

export default accountTypeRouter;
