import { Request, Response } from "express";
import {
  addInventory,
  editInventory,
  getAllInventories,
} from "../database/services/inventory.service";
import {
  createValidator,
  updateValidator,
} from "../utils/validators/inventory.validator";

export const getInventories = async (req: Request, res: Response) => {
  try {
    const inventories = await getAllInventories();
    console.log("successfully fetched all inventories");
    return res.status(200).send({ inventories });
  } catch (error) {
    console.log("error in fetching all inventories");
    console.log(error);
    return res.status(400).send({
      error: "invalid inputs",
    });
  }
};
export const createInventory = async (req: Request, res: Response) => {
  const input = createValidator.safeParse(req.body);

  if (!input.success) return res.status(400).send({ error: "Invalid inputs" });

  try {
    const newInventory = await addInventory(input.data);
    console.log("successfully created an inventory");
    return res.status(200).send({ inventory: newInventory });
  } catch (error) {
    console.log("error creating an inventory");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
export const updateInventory = async (req: Request, res: Response) => {
  const input = updateValidator.safeParse(req.body);

  if (!input.success)
    return res.status(400).send({
      error: input.error.errors[0].message,
    });

  try {
    const updatedInventory = await editInventory(input.data);
    console.log("successfully updated an inventory");
    return res.status(200).send({ inventory: updatedInventory });
  } catch (error) {
    console.log("error updating an inventory");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
