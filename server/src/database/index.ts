import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import accounts, { accountTypeRelation } from "./schema/accounts.schema";
import cheques, { chequesRelations } from "./schema/cheques.schema";
import customers from "./schema/customers.schema";
import employees from "./schema/employees.schema";
import inventory from "./schema/inventory.schema";
import payrolls, {
  payrollTransactionrelation,
  payrollEmployeeRelation,
} from "./schema/payrolls.schema";
import transactions, {
  transactionAccountRelation,
  transactionCustomerRelation,
  transactionEmployeeRelation,
  transactionVendorRelation,
  tranTypeRelation,
} from "./schema/transactions.schema";
import users from "./schema/users.schema";
import vendors from "./schema/vendors.schema";
import accountTypes, {
  accountTypesAccountManyRelations,
} from "./schema/accountType.schema";
import apiKeys from "./schema/apiKeyStore.schema";
import tranTypes, {
  tranTypeTransactionManyRelations,
} from "./schema/transactionTypes.schema";
import inventoryEntries, {
  inventoryEntriesCustomerRelation,
  inventoryEntriesInventoryRelations,
  inventoryEntriesTransactionRelation,
  inventoryEntriesVendorsRelations,
} from "./schema/inventoryEntries.schema";

// type DBSchema = {
//   accounts: MySqlTable;
//   users: MySqlTable;
//   employees: MySqlTable;
//   cheques: MySqlTable;
//   vendors: MySqlTable;
//   customers: MySqlTable;
//   inventory: MySqlTable;
//   transactions: MySqlTable;
//   payrolls: MySqlTable;
//   chequesRelations: Relations;
// };

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
    tranTypeTransactionManyRelations,
    tranTypeRelation,
    chequesRelations,
    transactionAccountRelation,
    transactionCustomerRelation,
    transactionEmployeeRelation,
    transactionVendorRelation,
    accountTypesAccountManyRelations,
    payrollEmployeeRelation,
    payrollTransactionrelation,
    accountTypeRelation,
    inventoryEntries,
    inventoryEntriesInventoryRelations,
    inventoryEntriesTransactionRelation,
    inventoryEntriesVendorsRelations,
    inventoryEntriesCustomerRelation,
  },
  mode: "default",
});

export default db;
