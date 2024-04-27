import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login } from "../controller/login.controller";
import { logout } from "../controller/logout.controller";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (_, res) => {
    res.status(429).json({
      error: "Too many requests, please try again later.",
    });
  },
});

const authRouter = Router();

authRouter.use(limiter);
authRouter.post("/login", login);

authRouter.post("/logout", logout);

export default authRouter;
