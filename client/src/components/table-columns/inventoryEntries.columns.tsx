import { ColumnDef } from '@tanstack/table-core'
import { Inventories } from './inventory.columns'
import { Button } from '../ui/button'
import { text } from '../ui/text'
import { ArrowUpDownIcon } from 'lucide-react'
import { Customer, Transactions, Vendor } from './transactions.columns'
import {
  InventoryEntryAccountColumn,
  InventoryEntryDateColumn,
  InventoryEntryInventoryColumn,
  InventoryEntryPartnerColumn,
  InventoryEntryTotalPriceColumn,
  InventoryEntryTypeColumn,
} from '../table-components/inventoryEntries.tblcomp'

export type InventoryEntries = {
  invEntryId: string
  invEntryTranId: string
  invEntryInvId: string
  invEntryTotalPrice: number
  invEntryDate: Date
  invEntryQuantity: number
  invEntryVdId: string
  invEntryCustId: string
  invEntryType: 'INCOMING' | 'OUTGOING'
  transaction: Transactions
  inventory: Inventories
  customer: Customer
  vendor: Vendor
}

export const inventoryEntriesColumns: ColumnDef<InventoryEntries>[] = [
  {
    accessorKey: 'invEntryDate',
    meta: 'Entry Date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Date
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: InventoryEntryDateColumn,
  },
  {
    accessorKey: 'invEntryQuantity',
    meta: 'Quantity',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Quantity
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'invEntryTotalPrice',
    meta: 'Total Price',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Total Price
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: InventoryEntryTotalPriceColumn,
  },
  {
    accessorKey: 'invEntryType',
    meta: 'Type',
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
    cell: InventoryEntryTypeColumn,
  },
  {
    accessorKey: 'invEntryAcc',
    accessorFn: (row) => row.transaction.account.accName,
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
    cell: InventoryEntryAccountColumn,
  },
  {
    accessorKey: 'invEntryInvId',
    meta: 'Inventory',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Inventory
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: InventoryEntryInventoryColumn,
  },
  {
    accessorKey: 'invEntryTranPartner',
    accessorFn: (row) => {
      if (row.invEntryCustId) return row.customer.custName
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

    cell: InventoryEntryPartnerColumn,
  },
]
