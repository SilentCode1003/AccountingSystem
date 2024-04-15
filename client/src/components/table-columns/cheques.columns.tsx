import { ColumnDef } from '@tanstack/react-table'

import {
  AccountColumn,
  CreatedAtColumn,
  IssueDateColumn,
  PayeeNameColumn,
  UpdatedAtColumn,
} from '../table-components/cheques.tblcomp'
import { Button } from '../ui/button'
import { text } from '../ui/text'
import { ArrowUpDownIcon } from 'lucide-react'

type Account = {
  accId: string
  accType: 'PAYABLE' | 'RECEIVABLE' | 'REVENUE' | 'EXPENSE'
  accAmount: number
  accDescription: string
  accIsActive: boolean
  accCreatedAt: boolean
  accUpdatedAt: boolean
}

export type Cheques = {
  chqId: string
  chqPayeeName: string
  chqAmount: number
  chqIssueDate: string
  chqStatus: 'APPROVED' | 'PENDING' | 'REJECTED'
  chqAccType: 'PAYABLE' | 'RECEIVABLE' | 'REVENUE' | 'EXPENSE'
  chqCreatedAt: string
  chqUpdatedAt: string
  chqAccId: string
  account: Account
}

export const chequeColumns: ColumnDef<Cheques>[] = [
  {
    accessorKey: 'chqIssueDate',
    filterFn: 'dateBetweenFilter',
    meta: 'Issue Date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Issue Date
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: IssueDateColumn,
  },
  {
    accessorKey: 'chqPayeeName',
    meta: 'Payee Name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Payee Name
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="min-w-32">{row.original.chqPayeeName}</div>
    ),
  },
  {
    accessorKey: 'chqAmount',
    meta: 'Amount',
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
    cell: PayeeNameColumn,
  },
  {
    accessorKey: 'chqAccId',
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
    cell: AccountColumn,
  },
  {
    accessorKey: 'chqStatus',
    meta: 'Status',
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
  },
  {
    accessorKey: 'chqCreatedAt',
    meta: 'Created At',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Created At
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: CreatedAtColumn,
  },
  {
    accessorKey: 'chqUpdatedAt',
    meta: 'Updated At',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Updated At
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: UpdatedAtColumn,
  },
]
