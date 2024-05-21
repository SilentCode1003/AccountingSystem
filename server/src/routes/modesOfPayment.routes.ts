import { Router } from "express";
import {
  createModeOfPayment,
  getModesOfPayments,
  toggleModeOfPaymentIsActive,
  updateModeOfPayment,
} from "../controller/modesOfPayment.controller";

const modesOfPaymentRouter = Router();

//get all modesOfPayment
modesOfPaymentRouter.get("/", getModesOfPayments);

//create a mode of payment
modesOfPaymentRouter.post("/", createModeOfPayment);

//update a mode of payment
modesOfPaymentRouter.put("/", updateModeOfPayment);

//toggle mode of payment is active
modesOfPaymentRouter.put("/:mopId", toggleModeOfPaymentIsActive);

export default modesOfPaymentRouter;
