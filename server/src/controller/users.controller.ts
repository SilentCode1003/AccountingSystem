import { NextFunction, Request, Response } from "express";
import {
  addUser,
  editUser,
  getAllUsers,
  getUserById,
  toggleIsActive,
} from "../database/services/users.service";
import {
  createValidator,
  getByIdValidator,
  toggleIsActiveValidator,
  updateValidator,
} from "../utils/validators/users.validator";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.query.userId) return next();
  try {
    const users = await getAllUsers();
    return res.status(200).send({
      users,
    });
  } catch (error) {
    return res.status(500).send({
      error: "Server error",
    });
  }
};

export const getSingleUserById = async (req: Request, res: Response) => {
  const input = getByIdValidator.safeParse(req.query);

  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0].message });

  try {
    const user = await getUserById(input.data);
    return res.status(200).send({
      user,
    });
  } catch (error) {
    return res.status(500).send({
      error: "Server error",
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const input = createValidator.safeParse(req.body);

  if (!input.success)
    return res.status(400).send({
      error: "Invalid inputs",
    });
  try {
    const newUser = await addUser(input.data);
    return res.status(200).send({ user: newUser });
  } catch (error) {
    return res.status(500).send({ error: "Server error" });
  }
};
export const updateUser = async (req: Request, res: Response) => {
  const input = updateValidator.safeParse(req.body);

  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0].message });
  try {
    const updatedUser = await editUser(input.data);
    return res.status(200).send({ user: updatedUser });
  } catch (error) {
    return res.status(500).send({ error: "Server error" });
  }
};
export const toggleUserIsActive = async (req: Request, res: Response) => {
  const input = toggleIsActiveValidator.safeParse(req.params);

  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0].message });

  try {
    const updatedUser = await toggleIsActive(input.data);
    return res.status(200).send({ user: updatedUser });
  } catch (error) {
    return res.status(500).send({ error: "Server error" });
  }
};
