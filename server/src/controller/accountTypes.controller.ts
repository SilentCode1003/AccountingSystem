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
    return res
      .status(200)
      .send({ success: true, deletedAccountTypeId: input.data.accTypeId });
  } catch (error) {
    return res.status(500).send({
      error: "Server error",
    });
  }
};
