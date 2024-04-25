import { ColumnDef } from '@tanstack/react-table'
import { Button } from '../ui/button'
import { Text, text } from '../ui/text'
import { ArrowUpDownIcon } from 'lucide-react'
import {
  ExpenseAmountColumn,
  IncomeStatementAccountNameColumn,
  RevenueAmountColumn,
} from '../table-components/incomeStatement.tblcomp'

export type Revenue = {
  accName: string
  amount: number
}

export type Expense = {
  accName: string
  amount: number
}

export const RevenueColumns: ColumnDef<Revenue>[] = [
  {
    accessorKey: 'accName',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Type
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: IncomeStatementAccountNameColumn,
    footer: () => {
      return <Text variant={'heading4bold'}>Total</Text>
    },
  },
  {
    accessorKey: 'amount',
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
    cell: RevenueAmountColumn,
    footer: ({ table }) => {
      const totalAmount = table
        .getFilteredRowModel()
        .rows.reduce(
          (total, row) => total + parseFloat(String(row.getValue('amount'))),
          0,
        )

      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
      }).format(totalAmount)

      return <Text variant={'heading4bold'}>{formatted}</Text>
    },
  },
]

export const ExpenseColumns: ColumnDef<Expense>[] = [
  {
    accessorKey: 'accName',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Type
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: IncomeStatementAccountNameColumn,
    footer: () => {
      return <Text variant={'heading4bold'}>Total</Text>
    },
  },
  {
    accessorKey: 'amount',
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
    cell: ExpenseAmountColumn,
    footer: ({ table }) => {
      const totalAmount = table
        .getFilteredRowModel()
        .rows.reduce(
          (total, row) => total + parseFloat(String(row.getValue('amount'))),
          0,
        )

      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
      }).format(totalAmount)

      return <Text variant={'heading4bold'}>{formatted}</Text>
    },
  },
]
