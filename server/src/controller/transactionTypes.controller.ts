import { Request, Response } from "express";
import {
  addTransactionType,
  editTransactionType,
  getAllTransactionTypes,
  removeTransactionType,
} from "../database/services/transactionTypes.service";
import {
  createValidator,
  deleteValidator,
  updateValidator,
} from "../utils/validators/transactionTypes.validator";
import db from "../database";

export const getTransactionTypes = async (req: Request, res: Response) => {
  try {
    const transactionTypes = await getAllTransactionTypes();
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
    const newTransactionType = await addTransactionType(input.data);
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
    const updatedTransactionType = await editTransactionType(input.data);
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

export const deleteTransactionType = async (req: Request, res: Response) => {
  const input = deleteValidator.safeParse(req.params);

  if (!input.success)
    return res.status(400).send({
      error: input.error.errors[0].message,
    });

  try {
    await removeTransactionType(input.data);
    console.log("successfully deleted a transaction type");
    return res
      .status(200)
      .send({ success: true, deletedTranTypeId: input.data.tranTypeId });
  } catch (error) {
    console.log("error deleting a transaction type");
    console.log(error);
    return res.status(500).send({
      error: "Server error",
    });
  }
};
