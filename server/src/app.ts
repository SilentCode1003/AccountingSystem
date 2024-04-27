import express from "express";
import accountRouter from "./routes/accounts.routes";
import employeesRouter from "./routes/employees.routes";
import usersRouter from "./routes/users.routes";
import chequeRouter from "./routes/cheque.routes";
import inventoryRouter from "./routes/inventory.routes";
import payrollRouter from "./routes/payrolls.routes";
import transactionRouter from "./routes/transactions.routes";
import vendorRouter from "./routes/vendors.routes";
import customerRouter from "./routes/customers.routes";
import cors from "cors";
import MongoStore from "connect-mongo";
import session from "express-session";
import "dotenv/config";
import { authMiddleware } from "./utils/middlewares/auth.middleware";
import { currentUser } from "./controller/login.controller";
import { getTransactionPartners } from "./controller/others.controllers";
import accountTypeRouter from "./routes/accountType.routes";
import authRouter from "./routes/auth.routes";
import othersRouter from "./routes/others.routes";
import fileUpload from "express-fileupload";
import { errorHandler } from "./utils/middlewares/errorHandler.middleware";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_URL as string],
    credentials: true,
  })
);
app.use(
  session({
    store: MongoStore.create({ mongoUrl: process.env.mongodb_url }),
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie:
      process.env.NODE_ENV === "PROD"
        ? {
            secure: true,
            httpOnly: true,
            sameSite: "none",
          }
        : undefined,
  })
);
app.use(fileUpload());

app.use(express.json());

app.use("/auth", authRouter);

app.use(authMiddleware);

app.use(express.static("files"));

app.get("/login", currentUser);

app.get("/transactionPartners", getTransactionPartners);

//route for all other actions
app.use("/others", othersRouter);

//route for all account actions
app.use("/accounts", accountRouter);

//route for all account type actions
app.use("/accountTypes", accountTypeRouter);

//route for all employee actions
app.use("/employees", employeesRouter);

//route for all customer actions
app.use("/customers", customerRouter);

//route for all user actions
app.use("/users", usersRouter);

//route for all cheque actions
app.use("/cheques", chequeRouter);

//route for all inventory actions
app.use("/inventory", inventoryRouter);

//route for all payroll actions
app.use("/payrolls", payrollRouter);

//route for all transaction actions
app.use("/transactions", transactionRouter);

//route for all vendor actions
app.use("/vendors", vendorRouter);

//route for uncatched error
app.use(errorHandler);

export default app;
