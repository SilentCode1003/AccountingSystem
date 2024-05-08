import { ColumnDef } from '@tanstack/react-table'
import { Button } from '../ui/button'
import { ArrowUpDownIcon } from 'lucide-react'
import { text } from '../ui/text'
import {
  InventoryPricePerUnitColumn,
  StatusColumn,
} from '../table-components/inventory.tblcomp'

export type Inventories = {
  invId: string
  invAssetName: string
  invStocks: number
  invStatus: 'GOOD' | 'WARNING' | 'DEPLETED'
  invPricePerUnit: number
}

export const inventoryColumns: ColumnDef<Inventories>[] = [
  {
    accessorKey: 'invAssetName',
    meta: 'Asset Name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Asset Name
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'invPricePerUnit',
    meta: 'Asset Price',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Asset Price
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: InventoryPricePerUnitColumn,
  },
  {
    accessorKey: 'invStocks',
    meta: 'Asset Stocks',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Asset Stocks
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'invStatus',
    meta: 'Asset Status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Asset Status
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: StatusColumn,
  },
]
