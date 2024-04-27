import { Request, Response } from "express";
import { loginValidator } from "../utils/validators/login.validator";
import db from "../database";
import { and, eq } from "drizzle-orm";
import * as bcrypt from "bcrypt";

export const login = async (req: Request, res: Response) => {
  const input = loginValidator.safeParse(req.body);

  if (!input.success) return res.status(400).send({ error: "Invalid inputs" });

  try {
    const checkUser = await db.query.users.findFirst({
      where: (user) => and(eq(user.userUsername, input.data.username)),
    });

    if (!checkUser)
      return res.status(404).send({
        error: "Username does not exist!",
      });

    const checkPassword = await bcrypt.compare(
      input.data.password,
      checkUser!.userPassword
    );

    if (!checkPassword)
      return res.status(404).send({
        error: "Password is wrong!",
      });

    req.session.userId = checkUser.userId as string;
    return res.sendStatus(200);
  } catch (error) {
    return res.send(500).send({ error: "Server error" });
  }
};

export const currentUser = async (req: Request, res: Response) => {
  try {
    const user = await db.query.users.findFirst({
      where: (user) => eq(user.userId, req.session.userId as string),
    });
    if (!user)
      return res.status(401).send({
        isLogged: false,
      });

    return res.status(200).send({
      isLogged: true,
      user: {
        userId: user!.userId,
        userType: user!.userType,
      },
    });
  } catch (error) {
    return res.status(500).send({ error: "Server Error" });
  }
};
