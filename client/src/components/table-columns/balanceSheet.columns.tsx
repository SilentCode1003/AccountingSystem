import { ColumnDef } from '@tanstack/react-table'
import { Button } from '../ui/button'
import { Text, text } from '../ui/text'
import { ArrowUpDownIcon } from 'lucide-react'
import {
  AssetAmountColumn,
  LiabilityAmountColumn,
} from '../table-components/balanceSheet.tblcomp'

export type Asset = {
  type: string
  amount: number
}

export type Liability = {
  type: string
  amount: number
}

export const assetsColumn: ColumnDef<Asset>[] = [
  {
    accessorKey: 'type',
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
    footer: () => {
      return <Text variant={'heading4bold'}>Total</Text>
    },
    meta: 'type',
  },
  {
    accessorKey: 'amount',
    meta: 'amount',
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
    cell: AssetAmountColumn,
    footer: ({ table }) => {
      const totalAmount = table
        .getFilteredRowModel()
        .rows.reduce(
          (total, row) => total + (row.getValue('amount') as number),
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

export const liabilitiesColumn: ColumnDef<Liability>[] = [
  {
    accessorKey: 'type',
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
    footer: () => {
      return <Text variant={'heading4bold'}>Total</Text>
    },
    meta: 'type',
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
    meta: 'amount',
    cell: LiabilityAmountColumn,
    footer: ({ table }) => {
      const totalAmount = table
        .getFilteredRowModel()
        .rows.reduce(
          (total, row) => total + (row.getValue('amount') as number),
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
