import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import accounts, { accountTypeRelation } from "./schema/accounts.schema";
import accountTypes, {
  accountTypesAccountManyRelations,
  accountTypeTransactionTypeManyRelations,
} from "./schema/accountType.schema";
import apiKeys from "./schema/apiKeyStore.schema";
import budgets, { budgetEmployeeRelation } from "./schema/Budget.schema";
import cheques, { chequesRelations } from "./schema/cheques.schema";
import customers from "./schema/customers.schema";
import employees from "./schema/employees.schema";
import forgetPasswordRequests from "./schema/forgetPasswordRequests.schema";
import inventory from "./schema/inventory.schema";
import inventoryEntries, {
  inventoryEntriesCustomerRelation,
  inventoryEntriesInventoryEntryProductsManyRelation,
  inventoryEntriesTransactionRelation,
  inventoryEntriesVendorRelation,
} from "./schema/inventoryEntries.schema";
import inventoryEntryProducts, {
  inventoryEntriesProductsInventoryEntryRelations,
  inventoryEntriesProductsInventoryRelations,
} from "./schema/inventoryEntriesProducts.schema";
import liquidations, {
  liquidationEmployeeRelation,
  liquidationRouteRelations,
} from "./schema/Liquidation.schema";
import modesOfPayment, {
  modesOfPaymentTransactionRelations,
} from "./schema/modeOfPayment";
import payrolls, {
  payrollEmployeeRelation,
  payrollTransactionrelation,
} from "./schema/payrolls.schema";
import transactions, {
  transactionAccountRelation,
  transactionCustomerRelation,
  transactionEmployeeRelation,
  transactionModeOfPaymentRelation,
  transactionVendorRelation,
  tranTypeRelation,
} from "./schema/transactions.schema";
import tranTypes, {
  tranTypeAccTypeIdRelations,
  tranTypeTransactionManyRelations,
} from "./schema/transactionTypes.schema";
import users from "./schema/users.schema";
import vendors from "./schema/vendors.schema";
import liquidationRoutes, {
  liquidationRoutesLiquidationRelation,
} from "./schema/liquidationRoutes.schema";

export const connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const db = drizzle(connection, {
  schema: {
    accounts,
    users,
    employees,
    cheques,
    accountTypes,
    vendors,
    customers,
    transactions,
    inventory,
    payrolls,
    apiKeys,
    tranTypes,
    liquidations,
    liquidationEmployeeRelation,
    liquidationRouteRelations,
    liquidationRoutes,
    liquidationRoutesLiquidationRelation,
    budgets,
    budgetEmployeeRelation,
    inventoryEntryProducts,
    inventoryEntriesProductsInventoryEntryRelations,
    inventoryEntriesProductsInventoryRelations,
    tranTypeTransactionManyRelations,
    tranTypeRelation,
    chequesRelations,
    transactionAccountRelation,
    transactionCustomerRelation,
    transactionEmployeeRelation,
    transactionVendorRelation,
    accountTypesAccountManyRelations,
    tranTypeAccTypeIdRelations,
    payrollEmployeeRelation,
    payrollTransactionrelation,
    accountTypeRelation,
    inventoryEntries,
    inventoryEntriesTransactionRelation,
    forgetPasswordRequests,
    inventoryEntriesInventoryEntryProductsManyRelation,
    accountTypeTransactionTypeManyRelations,
    inventoryEntriesVendorRelation,
    inventoryEntriesCustomerRelation,
    modesOfPayment,
    modesOfPaymentTransactionRelations,
    transactionModeOfPaymentRelation,
  },
  mode: "default",
});

export default db;
