import { Router } from "express";
import {
  createUser,
  getUsers,
  updateUser,
  toggleUserIsActive,
  getSingleUserById,
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

//delete but update users isactive instead
usersRouter.put("/:userId", toggleUserIsActive);

export default usersRouter;
