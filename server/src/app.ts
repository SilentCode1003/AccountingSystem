import compression from "compression";
import MongoStore from "connect-mongo";
import cors from "cors";
import "dotenv/config";
import express from "express";
import fileUpload from "express-fileupload";
import session from "express-session";
import morgan from "morgan";
import { currentUser } from "./controller/login.controller";
import { getTransactionPartners } from "./controller/others.controllers";
import accountRouter from "./routes/accounts.routes";
import accountTypeRouter from "./routes/accountType.routes";
import apiRouter from "./routes/api.routes";
import authRouter from "./routes/auth.routes";
import budgetRouter from "./routes/budgets.routes";
import chequeRouter from "./routes/cheque.routes";
import customerRouter from "./routes/customers.routes";
import employeesRouter from "./routes/employees.routes";
import forgetPasswordRequestsRouter from "./routes/forgetPasswordRequests.routes";
import inventoryRouter from "./routes/inventory.routes";
import inventoryEntryRouter from "./routes/inventoryEntries.routes";
import liquidationRouter from "./routes/liquidations.routes";
import modesOfPaymentRouter from "./routes/modesOfPayment.routes";
import othersRouter from "./routes/others.routes";
import payrollRouter from "./routes/payrolls.routes";
import transactionRouter from "./routes/transactions.routes";
import transactionTypesRouter from "./routes/transactionTypes.routes";
import usersRouter from "./routes/users.routes";
import vendorRouter from "./routes/vendors.routes";
import { authMiddleware } from "./utils/middlewares/auth.middleware";
import { errorHandler } from "./utils/middlewares/errorHandler.middleware";
import routesRouter from "./routes/routes.routes";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

const app = express();

app.use(morgan("dev"));
app.use(compression());

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

//route for all forget password request actions
app.use("/forgetPasswordRequests", forgetPasswordRequestsRouter);

app.use("/auth", authRouter);

//route for all external api actions
app.use("/api", apiRouter);

app.use(authMiddleware);

app.use(express.static("files"));

app.get("/login", currentUser);

app.get("/transactionPartners", getTransactionPartners);

//route for all other actions
app.use("/others", othersRouter);

//route for all account actions
app.use("/accounts", accountRouter);

//route for all budget actions
app.use("/budgets", budgetRouter);

//route for all liquidation actions
app.use("/liquidations", liquidationRouter);

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

//route for all inventory entries actions
app.use("/inventoryEntries", inventoryEntryRouter);

//route for all payroll actions
app.use("/payrolls", payrollRouter);

//route for all routes actions
app.use("/routes", routesRouter);

//route for all transaction actions
app.use("/transactions", transactionRouter);

//route for all transaction type actions
app.use("/transactionTypes", transactionTypesRouter);

//route for all modes of payment actions
app.use("/modesOfPayment", modesOfPaymentRouter);

//route for all vendor actions
app.use("/vendors", vendorRouter);

//route for uncatched error
app.use(errorHandler);

export default app;
