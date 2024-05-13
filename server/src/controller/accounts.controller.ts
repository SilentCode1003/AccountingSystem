import { Request, Response } from "express";
import {
  addAccount,
  editAccount,
  getAllAccounts,
  updateAccountIsActive,
} from "../database/services/accounts.service";
import {
  createValidator,
  toggleIsActiveValidator,
  updateValidator,
} from "../utils/validators/accounts.validator";

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await getAllAccounts();

    if (accounts) console.log("successfully fetched all accounts");
    return res.status(200).send({
      accounts,
    });
  } catch (error) {
    console.log("error in fetching all acounts");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
export const createAccount = async (req: Request, res: Response) => {
  const input = createValidator.safeParse(req.body);

  if (!input.success) return res.status(400).send({ error: "invalid input" });

  try {
    const newAccount = await addAccount({ ...input.data });
    console.log("successfully created an account");
    return res.status(200).send({ account: newAccount });
  } catch (error) {
    console.log("error creating an account");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};

export const updateAccount = async (req: Request, res: Response) => {
  const input = updateValidator.safeParse(req.body);

  if (!input.success)
    return res.status(400).send({
      error: input.error.errors[0].message,
    });

  try {
    const editedAccount = await editAccount(input.data);
    console.log("successfully updated an account");
    return res.status(200).send({ account: editedAccount });
  } catch (error) {
    console.log("error updating an account");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
export const toggleAccountIsActive = async (req: Request, res: Response) => {
  const input = toggleIsActiveValidator.safeParse(req.params);

  if (!input.success)
    return res.status(400).send({
      error: input.error.errors[0].message,
    });

  try {
    const editedAccount = await updateAccountIsActive({ ...input.data });
    console.log("successfully toggled an account");
    return res.status(200).send({
      account: editedAccount,
    });
  } catch (error) {
    console.log("error toggling an account");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
