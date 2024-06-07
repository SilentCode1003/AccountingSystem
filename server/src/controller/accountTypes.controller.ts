import { Request, Response } from "express";
import db from "../database";
import {
  addAccountType,
  changeAccountTypeIsActive,
  editAccountType,
  getAllAccountTypes,
} from "../database/services/accountType.service";
import {
  createValidator,
  deleteValidator,
  updateValidator,
} from "../utils/validators/accountType.validator";

export const getAccountTypes = async (req: Request, res: Response) => {
  try {
    const accountTypes = await getAllAccountTypes(db);
    console.log("successfully fetched all account types");
    return res.status(200).send({ accountTypes });
  } catch (error) {
    console.log(error);
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
    const accountType = await addAccountType(db, input.data);
    console.log("successfully created an account type");
    return res.status(200).send({ accountType });
  } catch (error) {
    console.log("error creating an account type");
    console.log(error);
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
    const accountType = await editAccountType(db, input.data);
    console.log("successfully updated an account type");
    return res.status(200).send({ accountType });
  } catch (error) {
    console.log("error updating an account type");
    console.log(error);
    return res.status(500).send({
      error: "Server error",
    });
  }
};

export const toggleAccountTypeIsActive = async (
  req: Request,
  res: Response
) => {
  const input = deleteValidator.safeParse(req.params);

  if (!input.success)
    return res.status(400).send({
      error: input.error.errors[0].message,
    });

  try {
    const accountType = await changeAccountTypeIsActive(db, input.data);
    console.log("successfully toggled account type");
    return res.status(200).send({ accountType });
  } catch (error) {
    console.log("error toggling account type");
    console.log(error);
    return res.status(500).send({
      error: "Server error",
    });
  }
};
