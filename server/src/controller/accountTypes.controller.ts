import { Request, Response } from "express";
import db from "../database";
import {
  addAccountType,
  editAccountType,
  getAllAccountTypes,
} from "../database/services/accountType.service";
import {
  createValidator,
  updateValidator,
} from "../utils/validators/accountType.validator";

export const getAccountTypes = async (req: Request, res: Response) => {
  try {
    const accountTypes = await getAllAccountTypes();
    return res.status(200).send({ accountTypes });
  } catch (error) {
    return res.status(500).send({
      error: "Server error",
    });
  }
};

export const createAccountType = async (req: Request, res: Response) => {
  const input = createValidator.safeParse(req.body);

  if (!input.success)
    return res.status(400).send({
      error: input.error.errors[0].message,
    });
  try {
    const accountType = await addAccountType(input.data);
    return res.status(200).send({ accountType });
  } catch (error) {
    return res.status(500).send({
      error: "Server error",
    });
  }
};

export const updateAccountType = async (req: Request, res: Response) => {
  const input = updateValidator.safeParse(req.body);

  if (!input.success)
    return res.status(400).send({
      error: input.error.errors[0].message,
    });
  try {
    const accountType = await editAccountType(input.data);
    return res.status(200).send({ accountType });
  } catch (error) {
    return res.status(500).send({
      error: "Server error",
    });
  }
};
