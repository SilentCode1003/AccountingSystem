import { ColumnDef } from '@tanstack/react-table'

import { Button } from '../ui/button'
import { ArrowUpDownIcon } from 'lucide-react'

import { text } from '../ui/text'
import { Employees } from './employees.columns'
import {
  TransactionAccountIDColumn,
  TransactionAmountColumn,
  TransactionDate,
  TransactionIndexColumn,
  TransactionWithColumn,
} from '../table-components/transactions.tblcomp'

type AccountType = {
  accTypeId: string
  accTypeName: string
}

type Account = {
  accId: string
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
}

export const transactionColumns: ColumnDef<Transactions>[] = [
  {
    accessorKey: 'tranId',
    meta: 'Transaction ID',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
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
          className={text({ variant: 'body', className: 'p-0' })}
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
          className={text({ variant: 'body', className: 'p-0' })}
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
          className={text({ variant: 'body', className: 'p-0' })}
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
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Transaction Partner
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },

    cell: TransactionWithColumn,
  },
]
