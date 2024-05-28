import { Router } from "express";
import {
  createUser,
  getUsers,
  updateUser,
  toggleUserIsActive,
  getSingleUserById,
  forgetPassword,
  changePassword,
} from "../controller/users.controller";

const usersRouter = Router();

//get all users
usersRouter.get("/", getUsers);

//get user by id
usersRouter.get("/", getSingleUserById);

//create an users entry
usersRouter.post("/", createUser);

//update an users
usersRouter.put("/", updateUser);

//toggle user is active
usersRouter.put("/:userId", toggleUserIsActive);

//forgot password
usersRouter.post("/forgetPassword", forgetPassword);

//change password
usersRouter.put("/changePassword/reset", changePassword);

export default usersRouter;
