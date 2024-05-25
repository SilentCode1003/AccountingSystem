import { Router } from "express";
import {
  createAccountType,
  getAccountTypes,
  toggleAccountTypeIsActive,
  updateAccountType,
} from "../controller/accountTypes.controller";

const accountTypeRouter = Router();

//get all accountTypes
accountTypeRouter.get("/", getAccountTypes);

//create an accountType entry
accountTypeRouter.post("/", createAccountType);

//update an accountType
accountTypeRouter.put("/", updateAccountType);

//toggle an accountType
accountTypeRouter.put("/:accTypeId", toggleAccountTypeIsActive);

export default accountTypeRouter;
