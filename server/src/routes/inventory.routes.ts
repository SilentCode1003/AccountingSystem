import { Router } from "express";
import {
  createInventory,
  getInventories,
  updateInventory,
} from "../controller/inventory.controller";

const inventoryRouter = Router();

//get all inventory
inventoryRouter.get("/", getInventories);

//create an inventory entry
inventoryRouter.post("/", createInventory);

//update an inventory
inventoryRouter.put("/", updateInventory);

export default inventoryRouter;
