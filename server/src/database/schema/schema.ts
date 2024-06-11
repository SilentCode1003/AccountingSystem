import accounts, { accountTypeRelation } from "./accounts.schema";
import accountTypes, {
  accountTypesAccountManyRelations,
  accountTypeTransactionTypeManyRelations,
} from "./accountType.schema";
import apiKeys from "./apiKeyStore.schema";
import budgets, { budgetEmployeeRelation } from "./Budget.schema";
import cheques, { chequesRelations } from "./cheques.schema";
import customers from "./customers.schema";
import employees from "./employees.schema";
import forgetPasswordRequests from "./forgetPasswordRequests.schema";
import inventory from "./inventory.schema";
import inventoryEntries, {
  inventoryEntriesCustomerRelation,
  inventoryEntriesInventoryEntryProductsManyRelation,
  inventoryEntriesTransactionRelation,
  inventoryEntriesVendorRelation,
} from "./inventoryEntries.schema";
import inventoryEntryProducts, {
  inventoryEntriesProductsInventoryEntryRelations,
  inventoryEntriesProductsInventoryRelations,
} from "./inventoryEntriesProducts.schema";
import liquidations, {
  liquidationEmployeeRelation,
  liquidationRouteRelations,
} from "./Liquidation.schema";
import liquidationRoutes, {
  liquidationRoutesLiquidationRelation,
} from "./liquidationRoutes.schema";
import modesOfPayment, {
  modesOfPaymentTransactionRelations,
} from "./modeOfPayment";
import payrolls, {
  payrollEmployeeRelation,
  payrollTransactionrelation,
} from "./payrolls.schema";
import routeDiscrepancies, {
  routeDiscrepancyLiquidationRouteRelation,
  routeDiscrepancyRouteRelation,
} from "./routeDiscrepancies.schema";
import routes from "./routes.schema";
import {
  runningBalance,
  runningBalanceEmployeeRelation,
  runningBalanceLiquidationRelation,
} from "./runningBalance.schema";
import transactions, {
  transactionAccountRelation,
  transactionCustomerRelation,
  transactionEmployeeRelation,
  transactionModeOfPaymentRelation,
  transactionVendorRelation,
  tranTypeRelation,
} from "./transactions.schema";
import tranTypes, {
  tranTypeAccTypeIdRelations,
  tranTypeTransactionManyRelations,
} from "./transactionTypes.schema";
import users from "./users.schema";
import vendors from "./vendors.schema";

const schema = {
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
  routes,
  routeDiscrepancies,
  routeDiscrepancyLiquidationRouteRelation,
  routeDiscrepancyRouteRelation,
  budgets,
  budgetEmployeeRelation,
  inventoryEntryProducts,
  inventoryEntriesProductsInventoryEntryRelations,
  inventoryEntriesProductsInventoryRelations,
  tranTypeTransactionManyRelations,
  tranTypeRelation,
  chequesRelations,
  runningBalance,
  runningBalanceEmployeeRelation,
  runningBalanceLiquidationRelation,
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
};

export default schema;
