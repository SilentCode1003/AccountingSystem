import { Router } from "express";
import {
  approveCheque,
  createCheque,
  createChequeByFile,
  getCheques,
  updateCheque,
} from "../controller/cheques.controller";

const chequeRouter = Router();

//get all cheque
chequeRouter.get("/", getCheques);

//create a cheque entry
chequeRouter.post("/", createCheque);

//create a cheque entry by file
chequeRouter.post("/file", createChequeByFile);

//update a cheque
chequeRouter.put("/", updateCheque);

//increase cheque approval count
chequeRouter.put("/:chqId", approveCheque);

export default chequeRouter;
