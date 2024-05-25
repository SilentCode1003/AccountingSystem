import {
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import {
  accountsOptions,
  accountTypeBarChartDataOptions,
  accountTypesOptions,
  accountTypeTotalPerMonthOptions,
  balanceSheetOptions,
  cashFlowBarChartDataOptions,
  chequesOptions,
  currentUserOptions,
  customersOptions,
  employeesOptions,
  incomeStatementOptions,
  inventoriesOptions,
  inventoryEntriesOptions,
  modesOfPaymentOptions,
  payrollsOptions,
  transactionPartnersOptions,
  transactionsOptions,
  transactionTypesOptions,
  userOptions,
  vendorsOptions,
} from './options'

export const useCurrentUser = () => {
  return useQuery(currentUserOptions())
}

export const useCurrentUserSuspense = () =>
  useSuspenseQuery(currentUserOptions())

export const useUser = () => {
  const queryClient = useQueryClient()
  return useQuery(userOptions(queryClient))
}

export const useUserSuspense = () => {
  const queryClient = useQueryClient()
  return useSuspenseQuery(userOptions(queryClient))
}

export const useTransactionPartners = () =>
  useQuery(transactionPartnersOptions())

export const useTransactions = () => useQuery(transactionsOptions())

export const useAccountTypes = () => useQuery(accountTypesOptions())

export const useAccountTypesSuspense = () =>
  useSuspenseQuery(accountTypesOptions())

export const useCheques = () => useQuery(chequesOptions())

export const useEmployees = () => useQuery(employeesOptions())

export const useCustomers = () => useQuery(customersOptions())

export const useVendors = () => useQuery(vendorsOptions())

export const useInventories = () => useQuery(inventoriesOptions())

export const useInventoryEntries = () => useQuery(inventoryEntriesOptions())

export const usePayrolls = () => useQuery(payrollsOptions())

export const useAccounts = () => useQuery(accountsOptions())

export const useModesOfPayment = () => useQuery(modesOfPaymentOptions())

export const useBalanceSheetSuspense = (date: Date, accTypes: string[]) =>
  useSuspenseQuery(balanceSheetOptions(date, accTypes))

export const useIncomeStatementSuspense = (date: Date, accTypes: string[]) =>
  useSuspenseQuery(incomeStatementOptions(date, accTypes))

export const useAccountTypeTotalPerMonth = (date: Date, accTypeId: string) =>
  useQuery(accountTypeTotalPerMonthOptions(date, accTypeId))

export const useAccountTypeBarChartData = (accTypeId: string) =>
  useQuery(accountTypeBarChartDataOptions(accTypeId))

export const useSuspenseCashFlowBarChartData = () =>
  useSuspenseQuery(cashFlowBarChartDataOptions())

export const useTransactionTypes = () => {
  return useQuery(transactionTypesOptions())
}
