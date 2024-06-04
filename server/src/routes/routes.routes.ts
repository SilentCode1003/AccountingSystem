import { Router } from "express";
import { getRoutes, updateRoute } from "../controller/routes.controller";

const routesRouter = Router();

//get all routes
routesRouter.get("/", getRoutes);

//update a route
routesRouter.put("/", updateRoute);

export default routesRouter;
