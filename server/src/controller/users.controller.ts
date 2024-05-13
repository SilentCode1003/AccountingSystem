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
    console.log("successfully fetched all users");
    return res.status(200).send({
      users,
    });
  } catch (error) {
    console.log("error in fetching all users");
    console.log(error);
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
    console.log("successfully fetched single user");
    return res.status(200).send({
      user,
    });
  } catch (error) {
    console.log(
      "error in fetching single user with id: " + JSON.stringify(input.data)
    );
    console.log(error);
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
    console.log("successfully created an user");
    return res.status(200).send({ user: newUser });
  } catch (error) {
    console.log("error creating an user");
    console.log(error);
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
    console.log("successfully updated an user");
    return res.status(200).send({ user: updatedUser });
  } catch (error) {
    console.log("error updating an user");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
export const toggleUserIsActive = async (req: Request, res: Response) => {
  const input = toggleIsActiveValidator.safeParse(req.params);

  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0].message });

  try {
    const updatedUser = await toggleIsActive(input.data);
    console.log("successfully toggled a user");
    return res.status(200).send({ user: updatedUser });
  } catch (error) {
    console.log("error toggling a user");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
