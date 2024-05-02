import { Router } from "express";
import {
  approveCheque,
  createCheque,
  getCheques,
  updateCheque,
} from "../controller/cheques.controller";

const chequeRouter = Router();

//get all cheque
chequeRouter.get("/", getCheques);

//create a cheque entry
chequeRouter.post("/", createCheque);

//update a cheque
chequeRouter.put("/", updateCheque);

//increase cheque approval count
chequeRouter.put("/:chqId", approveCheque);

export default chequeRouter;
