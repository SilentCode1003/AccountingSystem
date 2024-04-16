import { Router } from "express";
import {
  createAccountType,
  deleteAccountType,
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

//delete an accountType
accountTypeRouter.delete("/:accTypeId", deleteAccountType);

export default accountTypeRouter;
