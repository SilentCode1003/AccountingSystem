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
  chequesOptions,
  currentUserOptions,
  employeesOptions,
  incomeStatementOptions,
  inventoriesOptions,
  payrollsOptions,
  transactionPartnersOptions,
  transactionsOptions,
  userOptions,
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

export const useTransactionPartners = () => {
  return useQuery(transactionPartnersOptions())
}

export const useTransactions = () => {
  return useQuery(transactionsOptions())
}

export const useAccountTypes = () => {
  return useQuery(accountTypesOptions())
}

export const useAccountTypesSuspense = () =>
  useSuspenseQuery(accountTypesOptions())

export const useCheques = () => useQuery(chequesOptions())

export const useEmployees = () => useQuery(employeesOptions())

export const useInventories = () => useQuery(inventoriesOptions())

export const usePayrolls = () => useQuery(payrollsOptions())

export const useAccounts = () => useQuery(accountsOptions())

export const useBalanceSheetSuspense = (date: Date, accTypes: string[]) =>
  useSuspenseQuery(balanceSheetOptions(date, accTypes))

export const useIncomeStatementSuspense = (date: Date, accTypes: string[]) =>
  useSuspenseQuery(incomeStatementOptions(date, accTypes))

export const useAccountTypeTotalPerMonth = (date: Date, accTypeId: string) =>
  useQuery(accountTypeTotalPerMonthOptions(date, accTypeId))

export const useAccountTypeBarChartData = (accTypeId: string) =>
  useQuery(accountTypeBarChartDataOptions(accTypeId))
