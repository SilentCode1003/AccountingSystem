import { Router } from "express";
import { getSingleForgetPasswordRequestById } from "../controller/forgetPasswordRequests.controller";

const forgetPasswordRequestsRouter = Router();

//get a single forget password request
forgetPasswordRequestsRouter.get("/:id", getSingleForgetPasswordRequestById);

export default forgetPasswordRequestsRouter;
