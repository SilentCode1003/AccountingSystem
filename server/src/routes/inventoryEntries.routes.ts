import { Router } from "express";
import {
  createInventoryEntry,
  getInventoryEntries,
  updateInventoryEntry,
} from "../controller/inventoryEntries.controller";

const inventoryEntryRouter = Router();

//get all inventory entries
inventoryEntryRouter.get("/", getInventoryEntries);

//create an inventory entry
inventoryEntryRouter.post("/", createInventoryEntry);

//update an inventory entry
inventoryEntryRouter.put("/", updateInventoryEntry);

export default inventoryEntryRouter;
