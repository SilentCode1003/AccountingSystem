import { Router } from "express";
import {
  deleteRoute,
  getRoutes,
  updateRoute,
} from "../controller/routes.controller";

const routesRouter = Router();

//get all routes
routesRouter.get("/", getRoutes);

//update a route
routesRouter.put("/", updateRoute);

//delete a route
routesRouter.delete("/:routeId", deleteRoute);

export default routesRouter;
