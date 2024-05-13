import { ColumnDef } from '@tanstack/react-table'
import { Button } from '../ui/button'
import { Text, text } from '../ui/text'
import { ArrowUpDownIcon } from 'lucide-react'
import {
  AssetAmountColumn,
  BalanceSheetAccountNameColumn,
  LiabilityAmountColumn,
} from '../table-components/balanceSheet.tblcomp'

export type Asset = {
  accName: string
  amount: number
}

export type Liability = {
  accName: string
  amount: number
}

export const assetsColumn: ColumnDef<Asset>[] = [
  {
    accessorKey: 'accName',
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
          Type
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: BalanceSheetAccountNameColumn,
    footer: () => {
      return <Text variant={'heading4bold'}>Total</Text>
    },
    meta: 'accName',
  },
  {
    accessorKey: 'amount',
    meta: 'amount',
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
          Amount
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: AssetAmountColumn,
    footer: ({ table }) => {
      const totalAmount = table.getFilteredRowModel().rows.reduce(
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

export const liabilitiesColumn: ColumnDef<Liability>[] = [
  {
    accessorKey: 'accName',
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
          Type
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: BalanceSheetAccountNameColumn,
    footer: () => {
      return <Text variant={'heading4bold'}>Total</Text>
    },
    meta: 'accName',
  },
  {
    accessorKey: 'amount',
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
