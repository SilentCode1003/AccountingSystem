import { ColumnDef } from '@tanstack/react-table'

import { Button } from '../ui/button'
import { ArrowUpDownIcon } from 'lucide-react'

import { text } from '../ui/text'
import { Employees } from './employees.columns'
import {
  TransactionAccountIDColumn,
  TransactionAmountColumn,
  TransactionDate,
  transactionFileColumn,
  TransactionIndexColumn,
  TransactionTypeColumn,
  TransactionWithColumn,
} from '../table-components/transactions.tblcomp'
import { TransactionTypes } from './transactionTypes.columns'

type AccountType = {
  accTypeId: string
  accTypeName: string
}

type Account = {
  accId: string
  accName: string
  accTypeId: string
  accountType: AccountType
  accAmount: number
  accDescription: string
  accIsActive: boolean
  accCreatedAt: boolean
  accUpdatedAt: boolean
}

export type Vendor = {
  vdId: string
  vdName: string
  vdContactInfo: string
  vdEmail: string
  vdIsActive: string
}
export type Customer = {
  custId: string
  custName: string
  custAddress: string
  custContactInfo: string
  custEmail: string
  custIsActive: string
}

export type Transactions = {
  tranId: string
  tranAccId: string
  tranDescription: string
  tranAmount: number
  tranEmpId?: string
  tranCustId?: string
  tranVdId?: string
  tranTransactionDate: string
  tranCreatedAt: string
  tranUpdatedAt: string
  account: Account
  employee: Employees
  customer: Customer
  vendor: Vendor
  tranFile: string
  tranOtherPartner?: string
  tranTypeId: string
  transactionType: TransactionTypes
}

export const transactionColumns: ColumnDef<Transactions>[] = [
  {
    accessorKey: 'tranId',
    accessorFn: (_, index) => index,
    meta: 'Transaction ID',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({
            variant: 'bodybold',
            className: 'p-0 text-foreground',
          })}
        >
          Transaction ID
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: TransactionIndexColumn,
  },
  {
    accessorKey: 'tranAccId',
    meta: 'Account',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({
            variant: 'bodybold',
            className: 'p-0 text-foreground',
          })}
        >
          Account
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: TransactionAccountIDColumn,
  },
  {
    accessorKey: 'tranFile',
    meta: 'Transaction File',
    header: () => (
      <div
        className={text({
          variant: 'bodybold',
          className: 'p-0 text-foreground whitespace-nowrap',
        })}
      >
        Transaction File
      </div>
    ),
    cell: transactionFileColumn,
  },
  {
    accessorKey: 'tranTypeId',
    meta: 'Transaction Type',
    accessorFn: (row) => row.transactionType.tranTypeName,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({
            variant: 'bodybold',
            className: 'p-0 text-foreground',
          })}
        >
          Transaction Type
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: TransactionTypeColumn,
  },
  {
    accessorKey: 'tranAmount',
    meta: 'Transaction Amount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({
            variant: 'bodybold',
            className: 'p-0 text-foreground',
          })}
        >
          Transaction Amount
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: TransactionAmountColumn,
  },
  {
    accessorKey: 'tranTransactionDate',
    meta: 'Transaction Date',
    filterFn: 'dateBetweenFilter',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({
            variant: 'bodybold',
            className: 'p-0 text-foreground',
          })}
        >
          Transaction Date
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: TransactionDate,
  },
  {
    accessorKey: 'tranPartner',
    accessorFn: (row) => {
      if (row.tranEmpId) return row.employee.empName
      else if (row.tranCustId) return row.customer.custName
      else return row.vendor.vdName
    },
    meta: 'Transaction Partner',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({
            variant: 'bodybold',
            className: 'p-0 text-foreground',
          })}
        >
          Transaction Partner
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },

    cell: TransactionWithColumn,
  },
]

export const recentTransactionsColumns: ColumnDef<Transactions>[] = [
  {
    accessorKey: 'tranAccId',
    meta: 'Account',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({
            variant: 'bodybold',
            className: 'p-0 text-foreground',
          })}
        >
          Account
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: TransactionAccountIDColumn,
  },
  {
    accessorKey: 'tranAmount',
    meta: 'Transaction Amount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({
            variant: 'bodybold',
            className: 'p-0 text-foreground',
          })}
        >
          Transaction Amount
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: TransactionAmountColumn,
  },
  {
    accessorKey: 'tranTransactionDate',
    meta: 'Transaction Date',
    filterFn: 'dateBetweenFilter',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({
            variant: 'bodybold',
            className: 'p-0 text-foreground',
          })}
        >
          Transaction Date
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: TransactionDate,
  },
  {
    accessorKey: 'tranPartner',
    accessorFn: (row) => {
      if (row.tranEmpId) return row.employee.empName
      else if (row.tranCustId) return row.customer.custName
      else return row.vendor.vdName
    },
    meta: 'Transaction Partner',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({
            variant: 'bodybold',
            className: 'p-0 text-foreground',
          })}
        >
          Transaction Partner
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },

    cell: (c) => TransactionWithColumn({ ...c, dashboard: true }),
  },
]
