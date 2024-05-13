import { Request, Response } from "express";
import {
  addCustomer,
  editCustomer,
  getAllCustomers,
  updateCustomerIsActive,
} from "../database/services/customers.service";
import {
  createValidator,
  toggleIsActiveValidator,
  updateValidator,
} from "../utils/validators/customers.validator";

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await getAllCustomers();
    console.log("successfully fetched all customers");
    return res.status(200).send({
      customers,
    });
  } catch (error) {
    console.log("error in fetching all customers");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
export const createCustomer = async (req: Request, res: Response) => {
  const input = createValidator.safeParse(req.body);

  if (!input.success) return res.status(400).send({ error: "invalid input" });

  try {
    const newCustomer = await addCustomer(input.data);
    console.log("successfully created an customer");
    return res.status(200).send({ customer: newCustomer });
  } catch (error) {
    console.log("error creating an customer");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  const input = updateValidator.safeParse(req.body);

  if (!input.success)
    return res.status(400).send({
      error: input.error.errors[0].message,
    });

  try {
    const editedCustomer = await editCustomer(input.data);
    console.log("successfully updated an customer");
    return res.status(200).send({ customer: editedCustomer });
  } catch (error) {
    console.log("error updating an customer");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
export const toggleCustomerIsActive = async (req: Request, res: Response) => {
  const input = toggleIsActiveValidator.safeParse(req.params);

  if (!input.success)
    return res.status(400).send({
      error: input.error.errors[0].message,
    });

  try {
    const editedCustomer = await updateCustomerIsActive(input.data);

    console.log("successfully updated an customer");

    return res.status(200).send({
      customer: editedCustomer,
    });
  } catch (error) {
    console.log("error updating an customer");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
