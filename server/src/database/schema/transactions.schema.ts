import {
  AnyMySqlColumn,
  date,
  datetime,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";
import employees from "./employees.schema";
import accounts from "./accounts.schema";
import vendors from "./vendors.schema";
import customers from "./customers.schema";
import { decimal } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import tranTypes from "./transactionTypes.schema";
import modesOfPayment from "./modeOfPayment";

const transactions = mysqlTable("transactions", {
  tranId: varchar("tran_id", { length: 60 }).primaryKey(),
  tranAccId: varchar("tran_account_id", { length: 60 })
    .references((): AnyMySqlColumn => accounts.accId, { onDelete: "cascade" })
    .notNull(),
  tranDescription: text("tran_description").notNull(),
  tranAmount: decimal("tran_amount", { precision: 13, scale: 2 })
    .$type<number>()
    .notNull(),
  tranEmpId: varchar("tran_employee_id", { length: 60 }).references(
    (): AnyMySqlColumn => employees.empId,
    { onDelete: "cascade" }
  ),
  tranVdId: varchar("tran_vendor_id", { length: 60 }).references(
    (): AnyMySqlColumn => vendors.vdId,
    { onDelete: "cascade" }
  ),
  tranCustId: varchar("tran_customer_id", { length: 60 }).references(
    (): AnyMySqlColumn => customers.custId,
    { onDelete: "cascade" }
  ),
  tranMopId: varchar("tran_mop", { length: 60 })
    .notNull()
    .references((): AnyMySqlColumn => modesOfPayment.mopId, {
      onDelete: "cascade",
    }),
  tranTransactionDate: date("tran_transaction_date").notNull(),
  tranOtherPartner: text("tran_other_partner"),
  tranCreatedAt: datetime("tran_created_at").notNull().default(new Date()),
  tranUpdatedAt: datetime("tran_updated_at").notNull().default(new Date()),
  tranFile: text("tran_file").notNull(),
  tranTypeId: varchar("tran_type_id", { length: 60 }).references(
    (): AnyMySqlColumn => tranTypes.tranTypeId,
    { onDelete: "cascade" }
  ),
});

export const tranTypeRelation = relations(transactions, ({ one }) => ({
  transactionType: one(tranTypes, {
    fields: [transactions.tranTypeId],
    references: [tranTypes.tranTypeId],
  }),
}));

export const transactionModeOfPaymentRelation = relations(
  transactions,
  ({ one }) => ({
    modeOfPayment: one(modesOfPayment, {
      fields: [transactions.tranMopId],
      references: [modesOfPayment.mopId],
    }),
  })
);

export const transactionAccountRelation = relations(
  transactions,
  ({ one }) => ({
    account: one(accounts, {
      fields: [transactions.tranAccId],
      references: [accounts.accId],
    }),
  })
);

export const transactionEmployeeRelation = relations(
  transactions,
  ({ one }) => ({
    employee: one(employees, {
      fields: [transactions.tranEmpId],
      references: [employees.empId],
    }),
  })
);

export const transactionCustomerRelation = relations(
  transactions,
  ({ one }) => ({
    customer: one(customers, {
      fields: [transactions.tranCustId],
      references: [customers.custId],
    }),
  })
);

export const transactionVendorRelation = relations(transactions, ({ one }) => ({
  vendor: one(vendors, {
    fields: [transactions.tranVdId],
    references: [vendors.vdId],
  }),
}));

export default transactions;
