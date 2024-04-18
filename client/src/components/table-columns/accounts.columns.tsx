import { ColumnDef } from '@tanstack/react-table'
import { Button } from '../ui/button'
import { text } from '../ui/text'
import { ArrowUpDownIcon } from 'lucide-react'
import {
  AccountAmountColumn,
  AccountIsActiveColumn,
} from '../table-components/accounts.tblcomp'

export type Accounts = {
  accId: string
  accName: string
  accTypeId: string
  accDescription: string
  accAmount: number
  accIsActive: boolean
  accCreatedAt: string
  accUpdatedAt: string
  accountType: {
    accTypeId: string
    accTypeName: string
    accTypeDefault: string
  }
}

export const accountsColumns: ColumnDef<Accounts>[] = [
  {
    accessorKey: 'accName',
    meta: 'accName',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Account Name
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'accAmount',
    meta: 'accAmount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Amount
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: AccountAmountColumn,
  },
  {
    accessorKey: 'accountType',
    accessorFn: (row) => row.accountType.accTypeName,
    meta: 'accountType',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Account Type
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'accDescription',
    meta: 'accDescription',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Description
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'accIsActive',
    meta: 'accIsActive',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Status
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: AccountIsActiveColumn,
  },
]
