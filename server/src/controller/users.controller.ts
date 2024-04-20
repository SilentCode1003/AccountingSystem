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
import { UploadedFile } from "express-fileupload";
import path from "path";

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
  const userProfilePic = req.files
    ? (req.files!.userProfilePic as UploadedFile)
    : undefined;
  const input = updateValidator.safeParse({
    userId: req.body.userId,
    newData: {
      userUsername: req.body.userUsername,
      userFullName: req.body.userFullName,
      userPassword: req.body.userPassword,
      userContactNumber: req.body.userContactNumber,
      userProfilePic: undefined,
    },
  });
  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0].message });

  if (userProfilePic) {
    userProfilePic?.mv(
      path.join(
        __dirname,
        "..",
        "..",
        "files/profilepic/users",
        `${input.data.newData.userUsername}.${
          userProfilePic.mimetype.split("/")[1]
        }`
      )
    );
  }

  try {
    const updatedUser = await editUser({
      userId: input.data.userId,
      newData: {
        userProfilePic:
          userProfilePic &&
          `${input.data.newData.userUsername}.${
            userProfilePic?.mimetype.split("/")[1]
          }`,
        userContactNumber: input.data.newData.userContactNumber,
        userFullName: input.data.newData.userFullName,
        userUsername: input.data.newData.userUsername,
        userPassword: input.data.newData.userPassword,
      },
    });
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
