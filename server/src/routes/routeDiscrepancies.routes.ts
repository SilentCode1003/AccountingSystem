import { Router } from "express";

import {
  getRouteDiscrepancies,
  toggleRouteDiscrepancyIsResolved,
} from "../controller/routeDiscrepancies.controller";

const routeDiscrepanciesRouter = Router();

//get all route discrepancies
routeDiscrepanciesRouter.get("/", getRouteDiscrepancies);

//toggle route discrepancy
routeDiscrepanciesRouter.put("/:rdId", toggleRouteDiscrepancyIsResolved);

export default routeDiscrepanciesRouter;
