import { Request, Response } from "express";
import {
  addTransactionType,
  changeTransactionTypeIsActive,
  editTransactionType,
  getAllTransactionTypes,
} from "../database/services/transactionTypes.service";
import {
  createValidator,
  toggleIsActiveValidator,
  updateValidator,
} from "../utils/validators/transactionTypes.validator";
import db from "../database";

export const getTransactionTypes = async (req: Request, res: Response) => {
  try {
    const transactionTypes = await getAllTransactionTypes(db);
    console.log("successfully fetched all transaction types");
    return res.status(200).send({
      transactionTypes,
    });
  } catch (error) {
    console.log("error in fetching all transaction types");
    console.log(error);
    return res.status(500).send({
      error: "Server error",
    });
  }
};

export const createTransactionType = async (req: Request, res: Response) => {
  const input = createValidator.safeParse(req.body);

  if (!input.success)
    return res.status(400).send({
      error: input.error.errors[0].message,
    });

  try {
    const newTransactionType = await addTransactionType(db, input.data);
    console.log("successfully created a transaction type");
    return res.status(200).send({
      transactionType: newTransactionType,
    });
  } catch (error) {
    console.log("error creating a transaction type");
    console.log(error);
    return res.status(500).send({
      error: "Server error",
    });
  }
};

export const updateTransactionType = async (req: Request, res: Response) => {
  const input = updateValidator.safeParse(req.body);
  if (!input.success)
    return res.status(400).send({
      error: input.error.errors[0].message,
    });

  try {
    const updatedTransactionType = await editTransactionType(db, input.data);
    console.log("successfully updated a transaction type");
    return res.status(200).send({
      transactionType: updatedTransactionType,
    });
  } catch (error) {
    console.log("error updating a transaction type");
    console.log(error);
    return res.status(500).send({
      error: "Server error",
    });
  }
};

export const toggleTransactionTypeIsActive = async (
  req: Request,
  res: Response
) => {
  const input = toggleIsActiveValidator.safeParse(req.params);

  if (!input.success)
    return res.status(400).send({
      error: input.error.errors[0].message,
    });

  try {
    const updatedTransactionType = await changeTransactionTypeIsActive(
      db,
      input.data
    );
    console.log("successfully toggled a transaction type");
    return res.status(200).send({ transactionType: updatedTransactionType });
  } catch (error) {
    console.log("error toggling a transaction type");
    console.log(error);
    return res.status(500).send({
      error: "Server error",
    });
  }
};
