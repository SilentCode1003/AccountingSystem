import { Accounts } from '@/components/table-columns/accounts.columns'
import { AccountTypes } from '@/components/table-columns/accountTypes.column'
import { Budgets } from '@/components/table-columns/budgets.columns'
import { Cheques } from '@/components/table-columns/cheques.columns'
import { Customers } from '@/components/table-columns/customers.columns'
import { EmployeeBudgets } from '@/components/table-columns/employeeBudgets.columns'
import { EmployeeLiquidations } from '@/components/table-columns/employeeLiquidations.columns'
import { Employees } from '@/components/table-columns/employees.columns'
import { Inventories } from '@/components/table-columns/inventory.columns'
import { InventoryEntries } from '@/components/table-columns/inventoryEntries.columns'
import { Liquidations } from '@/components/table-columns/liquidations.columns'
import { ModesOfPayment } from '@/components/table-columns/modesOfPayment.columns'
import { Payrolls } from '@/components/table-columns/payrolls.columns'
import { RouteDiscrepancies } from '@/components/table-columns/routeDiscrepancies.columns'
import { Routes } from '@/components/table-columns/routes.columns'
import {
  Customer,
  Transactions,
  Vendor,
} from '@/components/table-columns/transactions.columns'
import { TransactionTypes } from '@/components/table-columns/transactionTypes.columns'
import { Users } from '@/components/table-columns/users.columns'
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

export const routesOptions = () => {
  return queryOptions({
    queryKey: ['routes'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/routes`,
        {
          credentials: 'include',
        },
      )

      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{
        routes: Array<Routes>
      }>

      return data
    },
  })
}

export const routeDiscrepanciesOptions = () => {
  return queryOptions({
    queryKey: ['routeDiscrepancies'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/routeDiscrepancies`,
        {
          credentials: 'include',
        },
      )

      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{
        routeDiscrepancies: Array<RouteDiscrepancies>
      }>

      return data
    },
  })
}

export const forgetPasswordRequestOptions = (id: string) => {
  return queryOptions({
    queryKey: ['forgetPasswordRequest'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/forgetPasswordRequests/${id}`,
        {
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{
        id: string
        userId: string
        remarks: string
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
        user: Users
      }>

      return data
    },
  })
}
export const usersOptions = (queryClient: QueryClient) => {
  return queryOptions({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/users`, {
        credentials: 'include',
      })
      if (!response.ok) throw new Error((await response.json()).error)

      const data = (await response.json()) as Promise<{
        users: Array<Users>
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

export const budgetsOptions = () => {
  return queryOptions({
    queryKey: ['budgets'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/budgets`,
        {
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)
      const data = response.json() as Promise<{
        budgets: Array<Budgets>
      }>
      return data
    },
  })
}

export const employeeBudgetsOptions = ({ date }: { date?: Date }) => {
  return queryOptions({
    queryKey: ['employeeBudgets', { date: date ? date.getMonth() : undefined }],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/budgets/employeeBudgets` +
          (date
            ? '?' +
              new URLSearchParams({
                date: date.toISOString(),
              })
            : ''),
        {
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)
      const data = response.json() as Promise<{
        employeeBudgets: Array<EmployeeBudgets>
      }>
      return data
    },
  })
}

export const employeeLiquidationsOptions = ({ date }: { date?: Date }) => {
  return queryOptions({
    queryKey: [
      'employeeLiquidations',
      { date: date ? date.getMonth() : undefined },
    ],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/liquidations/employeeLiquidations` +
          (date
            ? '?' +
              new URLSearchParams({
                date: date.toISOString(),
              })
            : ''),
        {
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)
      const data = response.json() as Promise<{
        employeeLiquidations: Array<EmployeeLiquidations>
      }>
      return data
    },
  })
}

export const liquidationsOptions = () => {
  return queryOptions({
    queryKey: ['liquidations'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/liquidations`,
        {
          credentials: 'include',
        },
      )
      if (!response.ok) throw new Error((await response.json()).error)
      const data = response.json() as Promise<{
        liquidations: Array<Liquidations>
      }>
      return data
    },
  })
}
