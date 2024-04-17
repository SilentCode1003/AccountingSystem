import { Router } from "express";
import { getAccountTotal } from "../controller/others.controllers";

const othersRouter = Router();

//get total sum of an account type
othersRouter.post("/accountTotal", getAccountTotal);

export default othersRouter;
