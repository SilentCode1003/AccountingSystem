import { Request, Response } from "express";
import {
  addVendor,
  editVendor,
  getAllVendors,
  toggleIsActive,
} from "../database/services/vendors.service";
import {
  createValidator,
  toggleIsActiveValidator,
  updateValidator,
} from "../utils/validators/vendors.validator";

export const getVendors = async (req: Request, res: Response) => {
  try {
    const vendors = await getAllVendors();
    console.log("successfully fetched all vendors");
    return res.status(200).send({
      vendors,
    });
  } catch (error) {
    console.log("error in fetching all vendors");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
export const createVendor = async (req: Request, res: Response) => {
  const input = createValidator.safeParse(req.body);

  if (!input.success)
    return res.status(400).send({
      error: "Invalid inputs",
    });
  try {
    const newVendor = await addVendor(input.data);
    console.log("successfully created an vendor");
    return res.status(200).send({ vendor: newVendor });
  } catch (error) {
    console.log("error creating an vendor");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
export const updateVendor = async (req: Request, res: Response) => {
  const input = updateValidator.safeParse(req.body);

  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0].message });

  try {
    const updatedVendor = await editVendor(input.data);
    console.log("successfully updated an vendor");
    return res.status(200).send({ vendor: updatedVendor });
  } catch (error) {
    console.log("error updating an vendor");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
export const toggleVendorIsActive = async (req: Request, res: Response) => {
  const input = toggleIsActiveValidator.safeParse(req.params);

  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0].message });

  try {
    const updatedVendor = await toggleIsActive(input.data);
    console.log("successfully updated an vendor");
    return res.status(200).send({ vendor: updatedVendor });
  } catch (error) {
    console.log("error updating an vendor");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
