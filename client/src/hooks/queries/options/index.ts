import { Accounts } from '@/components/table-columns/accounts.columns'
import { AccountTypes } from '@/components/table-columns/accountTypes.column'
import { Cheques } from '@/components/table-columns/cheques.columns'
import { Customers } from '@/components/table-columns/customers.columns'
import { Employees } from '@/components/table-columns/employees.columns'
import { Inventories } from '@/components/table-columns/inventory.columns'
import { InventoryEntries } from '@/components/table-columns/inventoryEntries.columns'
import { ModesOfPayment } from '@/components/table-columns/modesOfPayment.columns'
import { Payrolls } from '@/components/table-columns/payrolls.columns'
import {
  Customer,
  Transactions,
  Vendor,
} from '@/components/table-columns/transactions.columns'
import { TransactionTypes } from '@/components/table-columns/transactionTypes.columns'
import { Vendors } from '@/components/table-columns/vendors.columns'
import { QueryClient, queryOptions } from '@tanstack/react-query'

export const currentUserOptions = () => {
  return queryOptions({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/login`, {
        credentials: 'include',
      })

      if (!response.ok)
        return {
          isLogged: false,
        }

      const data = (await response.json()) as Promise<{
        isLogged: boolean
        user?: {
          userId: string
          userType: string
        }
      }>

      return data
    },
  })
}

export const userOptions = (queryClient: QueryClient) => {
  return queryOptions({
    queryKey: ['userData'],
    queryFn: async () => {
      const userId = queryClient.getQueryData<{
        isLogged: boolean
        user: {
          userId: string
          userType: string
        }
      }>(['currentUser'])
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/users/?` +
          new URLSearchParams({ userId: userId?.user.userId as string }),
        {
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{
        user: {
          userUsername: string
          userFullName: string
          userContactNumber: string
          userProfilePic: string
        }
      }>

      return data
    },
  })
}

export const transactionPartnersOptions = () => {
  return queryOptions({
    queryKey: ['transactionPartners'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/transactionPartners`,
        {
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)
      const data = response.json() as Promise<{
        employees: Array<Employees>
        customers: Array<Customer>
        vendors: Array<Vendor>
      }>
      return data
    },
  })
}

export const transactionsOptions = () =>
  queryOptions({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/transactions`,
        {
          credentials: 'include',
        },
      )

      if (!response.ok) throw new Error((await response.json()).error)
      const transactionData = (await response.json()) as Promise<{
        transactions: Array<Transactions>
      }>

      return transactionData
    },
  })

export const transactionTypesOptions = () =>
  queryOptions({
    queryKey: ['transactionTypes'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/transactionTypes`,
        {
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)
      const data = (await response.json()) as Promise<{
        transactionTypes: Array<TransactionTypes>
      }>
      return data
    },
  })

export const modesOfPaymentOptions = () =>
  queryOptions({
    queryKey: ['modesOfPayment'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/modesOfPayment`,
        {
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)
      const data = (await response.json()) as Promise<{
        modesOfPayment: Array<ModesOfPayment>
      }>
      return data
    },
  })

export const accountTypesOptions = () =>
  queryOptions({
    queryKey: ['accountTypes'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/accountTypes`,
        {
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)
      const data = (await response.json()) as Promise<{
        accountTypes: Array<AccountTypes>
      }>
      return data
    },
  })

export const chequesOptions = () =>
  queryOptions({
    queryKey: ['cheques'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/cheques`,
        {
          credentials: 'include',
        },
      )

      if (!response.ok) throw new Error((await response.json()).error)
      const data = (await response.json()) as Promise<{
        cheques: Array<Cheques>
      }>

      return data
    },
  })

export const employeesOptions = () =>
  queryOptions({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/employees`,
        {
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)
      const data = (await response.json()) as Promise<{
        employees: Array<Employees>
      }>

      return data
    },
  })

export const customersOptions = () =>
  queryOptions({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/customers`,
        {
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)
      const data = (await response.json()) as Promise<{
        customers: Array<Customers>
      }>

      return data
    },
  })
export const vendorsOptions = () =>
  queryOptions({
    queryKey: ['vendors'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/vendors`,
        {
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)
      const data = (await response.json()) as Promise<{
        vendors: Array<Vendors>
      }>

      return data
    },
  })

export const inventoriesOptions = () =>
  queryOptions({
    queryKey: ['inventories'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/inventory`,
        {
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)
      const data = (await response.json()) as Promise<{
        inventories: Array<Inventories>
      }>
      return data
    },
  })

export const inventoryEntriesOptions = () =>
  queryOptions({
    queryKey: ['inventoryEntries'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/inventoryEntries`,
        {
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)
      const data = (await response.json()) as Promise<{
        inventoryEntries: Array<InventoryEntries>
      }>
      return data
    },
  })

export const payrollsOptions = () =>
  queryOptions({
    queryKey: ['payrolls'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/payrolls`,
        {
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)
      const data = (await response.json()) as Promise<{
        payrolls: Array<Payrolls>
      }>
      return data
    },
  })

export const accountsOptions = () =>
  queryOptions({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/accounts`,
        {
          credentials: 'include',
        },
      )

      if (!response.ok) throw new Error((await response.json()).error)
      const data = (await response.json()) as Promise<{
        accounts: Array<Accounts>
      }>

      return data
    },
  })

export const balanceSheetOptions = (date: Date, accTypes: Array<string>) =>
  queryOptions({
    queryKey: ['balanceSheet', { month: date.getMonth() }, { accTypes }],

    queryFn: async () => {
      let params = new URLSearchParams({
        month: date.toString(),
      })

      accTypes.map((accType) => {
        params.append('accTypes', accType)
      })

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/others/balanceSheet/?` + params,
        {
          credentials: 'include',
        },
      )

      if (!response.ok) throw new Error((await response.json()).error)
      const data = (await response.json()) as Promise<
        Array<{
          accTypeId: string
          accTypeName: string
          accounts: Array<{
            accName: string
            amount: number
          }>
        }>
      >
      return data
    },
  })

export const incomeStatementOptions = (date: Date, accTypes: Array<string>) =>
  queryOptions({
    queryKey: [
      'incomeStatement',
      { month: date.getMonth() },
      {
        accTypes,
      },
    ],
    queryFn: async () => {
      let params = new URLSearchParams({
        month: date.toString(),
      })

      accTypes.map((accType) => {
        params.append('accTypes', accType)
      })

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/others/incomeStatement/?` + params,
        {
          credentials: 'include',
        },
      )

      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<
        Array<{
          accTypeId: string
          accTypeName: string
          accounts: Array<{
            accName: string
            amount: number
          }>
        }>
      >
      return data
    },
  })

export const accountTypeBarChartDataOptions = (accTypeId: string) =>
  queryOptions({
    queryKey: ['AccountTypeBarChartData', { accTypeId }],
    queryFn: async () => {
      let params = new URLSearchParams({
        accTypeId,
      })

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/others/AccountTypeBarChartData?` +
          params,
        {
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)
      const data = (await response.json()) as Promise<{
        data: {
          keys: Array<string>
          data: Array<any>
        }
      }>
      return data
    },
  })

export const accountTypeTotalPerMonthOptions = (
  date: Date,
  accTypeId: string,
) =>
  queryOptions({
    queryKey: [
      'accountTypeTotalPerMonth',
      { date: date.getMonth() },
      { accTypeId },
    ],
    queryFn: async () => {
      let params = new URLSearchParams({
        date: date.toISOString(),
        accTypeId,
      })

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/others/accountTypeTotal/?` + params,
        {
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)
      const data = (await response.json()) as Promise<{
        accountTypeName: string
        total: number
        percentAgainstPrevMonth: number
      }>
      return data
    },
  })

export const cashFlowBarChartDataOptions = () =>
  queryOptions({
    queryKey: ['cashFlowBarChart'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/others/cashFlowBarChart`,
        {
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)
      const data = (await response.json()) as Promise<{
        dataKeys: Array<string>
        data: Array<any>
      }>

      return data
    },
  })
