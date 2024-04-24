import { Accounts } from '@/components/table-columns/accounts.columns'
import { AccountTypes } from '@/components/table-columns/accountTypes.column'
import { Cheques } from '@/components/table-columns/cheques.columns'
import { Employees } from '@/components/table-columns/employees.columns'
import { Inventories } from '@/components/table-columns/inventory.columns'
import { Payrolls } from '@/components/table-columns/payrolls.columns'
import {
  Customer,
  Transactions,
  Vendor,
} from '@/components/table-columns/transactions.columns'
import { QueryClient, queryOptions } from '@tanstack/react-query'

export const currentUserOptions = () => {
  return queryOptions({
    queryKey: ['CurrentUser'],
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
      }>(['CurrentUser'])
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
    queryKey: ['TransactionPartners'],
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
    queryKey: ['Transactions'],
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
    queryKey: ['Cheques'],
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
    queryKey: ['Employees'],
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

export const inventoriesOptions = () =>
  queryOptions({
    queryKey: ['Inventories'],
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

export const payrollsOptions = () =>
  queryOptions({
    queryKey: ['Payrolls'],
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
      'AccountTypeTotalPerMonth',
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
        accounts: Array<{
          name: string
          total: number
        }>
      }>
      return data
    },
  })
