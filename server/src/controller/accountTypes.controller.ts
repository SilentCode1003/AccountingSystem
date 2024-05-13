import { Request, Response } from "express";
import db from "../database";
import {
  addAccountType,
  editAccountType,
  getAllAccountTypes,
} from "../database/services/accountType.service";
import {
  createValidator,
  deleteValidator,
  updateValidator,
} from "../utils/validators/accountType.validator";
import accountTypes from "../database/schema/accountType.schema";
import { eq } from "drizzle-orm";

export const getAccountTypes = async (req: Request, res: Response) => {
  try {
    const accountTypes = await getAllAccountTypes();
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
    const accountType = await addAccountType(input.data);
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
    const accountType = await editAccountType(input.data);
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

export const deleteAccountType = async (req: Request, res: Response) => {
  const input = deleteValidator.safeParse(req.params);

  if (!input.success)
    return res.status(400).send({
      error: input.error.errors[0].message,
    });

  try {
    await db
      .delete(accountTypes)
      .where(eq(accountTypes.accTypeId, input.data.accTypeId));
    console.log("successfully deleted an account type");
    return res
      .status(200)
      .send({ success: true, deletedAccountTypeId: input.data.accTypeId });
  } catch (error) {
    console.log("error deleting an account type");
    console.log(error);
    return res.status(500).send({
      error: "Server error",
    });
  }
};
