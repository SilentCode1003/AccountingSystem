import { Router } from "express";
import { getLiquidations } from "../controller/liquidations.controller";

const liquidationRouter = Router();

//get all liquidations
liquidationRouter.get("/", getLiquidations);

export default liquidationRouter;
