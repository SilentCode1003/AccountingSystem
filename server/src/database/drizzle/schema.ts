import {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  primaryKey,
  varchar,
  mysqlEnum,
  decimal,
  text,
  tinyint,
  datetime,
  foreignKey,
  date,
  unique,
  int,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const accounts = mysqlTable(
  "accounts",
  {
    accId: varchar("acc_id", { length: 60 }).notNull(),
    accType: mysqlEnum("acc_type", [
      "PAYABLE",
      "RECEIVABLE",
      "REVENUE",
      "EXPENSE",
    ]).notNull(),
    accAmount: decimal("acc_amount", { precision: 13, scale: 2 }).notNull(),
    accDescription: text("acc_description").notNull(),
    accIsActive: tinyint("acc_is_active").default(1).notNull(),
    accCreatedAt: datetime("acc_created_at", { mode: "string" })
      .default("2024-04-06 02:03:06")
      .notNull(),
    accUpdatedAt: datetime("acc_updated_at", { mode: "string" })
      .default("2024-04-06 02:03:06")
      .notNull(),
  },
  (table) => {
    return {
      accountsAccId: primaryKey({
        columns: [table.accId],
        name: "accounts_acc_id",
      }),
    };
  }
);

export const cheques = mysqlTable(
  "cheques",
  {
    chqId: varchar("chq_id", { length: 60 }).notNull(),
    chqPayeeName: varchar("chq_payee_name", { length: 50 }).notNull(),
    chqAmount: decimal("chq_amount", { precision: 13, scale: 2 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    chqIssueDate: date("chq_issue_date", { mode: "string" }).notNull(),
    chqStatus: mysqlEnum("chq_status", ["APPROVED", "PENDING", "REJECTED"]),
    chqAccountId: varchar("chq_account_id", { length: 60 })
      .notNull()
      .references(() => accounts.accId, { onDelete: "cascade" }),
    chqCreatedAt: datetime("chq_created_at", { mode: "string" })
      .default("2024-04-06 02:03:06")
      .notNull(),
    chqUpdatedAt: datetime("chq_updated_at", { mode: "string" })
      .default("2024-04-06 02:03:06")
      .notNull(),
  },
  (table) => {
    return {
      chequesChqId: primaryKey({
        columns: [table.chqId],
        name: "cheques_chq_id",
      }),
    };
  }
);

export const customers = mysqlTable(
  "customers",
  {
    custId: varchar("cust_id", { length: 60 }).notNull(),
    custName: varchar("cust_name", { length: 50 }).notNull(),
    custAddress: varchar("cust_address", { length: 50 }).notNull(),
    custContactInfo: varchar("cust_contact_info", { length: 15 }).notNull(),
    custEmail: varchar("cust_email", { length: 50 }).notNull(),
    custIsActive: tinyint("cust_is_active").default(1).notNull(),
  },
  (table) => {
    return {
      customersCustId: primaryKey({
        columns: [table.custId],
        name: "customers_cust_id",
      }),
      customersCustEmailUnique: unique("customers_cust_email_unique").on(
        table.custEmail
      ),
    };
  }
);

export const employees = mysqlTable(
  "employees",
  {
    empId: varchar("emp_id", { length: 60 }).notNull(),
    empName: varchar("emp_name", { length: 50 }),
    empAddress: varchar("emp_address", { length: 50 }).notNull(),
    empContactInfo: varchar("emp_contact_info", { length: 15 }).notNull(),
    empEmail: varchar("emp_email", { length: 50 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    empBirthdate: date("emp_birthdate", { mode: "string" }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    empDateHired: date("emp_date_hired", { mode: "string" }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    empDateTerminated: date("emp_date_terminated", { mode: "string" }),
    empSalary: decimal("emp_salary", { precision: 13, scale: 2 }).notNull(),
  },
  (table) => {
    return {
      employeesEmpId: primaryKey({
        columns: [table.empId],
        name: "employees_emp_id",
      }),
      employeesEmpEmailUnique: unique("employees_emp_email_unique").on(
        table.empEmail
      ),
    };
  }
);

export const inventory = mysqlTable(
  "inventory",
  {
    invId: varchar("inv_id", { length: 60 }).notNull(),
    invAssetName: varchar("inv_asset_name", { length: 40 }).notNull(),
    invStocks: int("inv_stocks").notNull(),
    invStatus: mysqlEnum("inv_status", ["GOOD", "WARNING", "DEPLETED"]),
  },
  (table) => {
    return {
      inventoryInvId: primaryKey({
        columns: [table.invId],
        name: "inventory_inv_id",
      }),
      inventoryInvAssetNameUnique: unique("inventory_inv_asset_name_unique").on(
        table.invAssetName
      ),
    };
  }
);

export const payrolls = mysqlTable(
  "payrolls",
  {
    prId: varchar("pr_id", { length: 60 }).notNull(),
    prEmployeeId: varchar("pr_employee_id", { length: 60 })
      .notNull()
      .references(() => employees.empId, { onDelete: "cascade" }),
    prTotalDeduction: decimal("pr_total_deduction", {
      precision: 13,
      scale: 2,
    }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    prDateFrom: date("pr_date_from", { mode: "string" }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    prDateTo: date("pr_date_to", { mode: "string" }).notNull(),
    prFinalAmount: decimal("pr_final_amount", { precision: 13, scale: 2 }),
  },
  (table) => {
    return {
      payrollsPrId: primaryKey({
        columns: [table.prId],
        name: "payrolls_pr_id",
      }),
    };
  }
);

export const transactions = mysqlTable(
  "transactions",
  {
    tranId: varchar("tran_id", { length: 60 }).notNull(),
    tranAccountId: varchar("tran_account_id", { length: 60 })
      .notNull()
      .references(() => accounts.accId, { onDelete: "cascade" }),
    tranDescription: text("tran_description").notNull(),
    tranAmount: decimal("tran_amount", { precision: 13, scale: 2 }).notNull(),
    tranEmployeeId: varchar("tran_employee_id", { length: 60 }).references(
      () => employees.empId,
      { onDelete: "cascade" }
    ),
    tranVendorId: varchar("tran_vendor_id", { length: 60 }).references(
      () => vendors.vdId,
      { onDelete: "cascade" }
    ),
    tranCustomerId: varchar("tran_customer_id", { length: 60 }).references(
      () => customers.custId,
      { onDelete: "cascade" }
    ),
    tranTransactionDate: datetime("tran_transaction_date", {
      mode: "string",
    }).notNull(),
    tranCreatedAt: datetime("tran_created_at", { mode: "string" })
      .default("2024-04-06 02:03:06")
      .notNull(),
    tranUpdatedAt: datetime("tran_updated_at", { mode: "string" })
      .default("2024-04-06 02:03:06")
      .notNull(),
  },
  (table) => {
    return {
      transactionsTranId: primaryKey({
        columns: [table.tranId],
        name: "transactions_tran_id",
      }),
    };
  }
);

export const users = mysqlTable(
  "users",
  {
    userId: varchar("user_id", { length: 60 }).notNull(),
    userType: mysqlEnum("user_type", ["FINANCE", "HIGHER_DEPARTMENT"]),
    userUsername: varchar("user_username", { length: 16 }).notNull(),
    userPassword: varchar("user_password", { length: 16 }).notNull(),
    userIsActive: tinyint("user_is_active").default(1).notNull(),
  },
  (table) => {
    return {
      usersUserId: primaryKey({
        columns: [table.userId],
        name: "users_user_id",
      }),
    };
  }
);

export const vendors = mysqlTable(
  "vendors",
  {
    vdId: varchar("vd_id", { length: 60 }).notNull(),
    vdName: varchar("vd_name", { length: 50 }).notNull(),
    vdAddress: varchar("vd_address", { length: 50 }).notNull(),
    vdContactInfo: varchar("vd_contact_info", { length: 15 }).notNull(),
    vdEmail: varchar("vd_email", { length: 50 }).notNull(),
    vdIsActive: tinyint("vd_is_active").default(1).notNull(),
  },
  (table) => {
    return {
      vendorsVdId: primaryKey({ columns: [table.vdId], name: "vendors_vd_id" }),
      vendorsVdEmailUnique: unique("vendors_vd_email_unique").on(table.vdEmail),
    };
  }
);
