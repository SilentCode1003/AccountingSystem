import { ColumnDef } from '@tanstack/table-core'
import { ArrowUpDownIcon } from 'lucide-react'
import {
  InventoryEntryAccountColumn,
  InventoryEntryDateColumn,
  InventoryEntryPartnerColumn,
  InventoryEntryTotalPriceColumn,
  InventoryEntryTypeColumn,
} from '../table-components/inventoryEntries.tblcomp'
import { Button } from '../ui/button'
import { text } from '../ui/text'
import { Inventories } from './inventory.columns'
import { Customer, Transactions, Vendor } from './transactions.columns'
import { InventoryEntryProducts } from './inventoryEntryProducts.columns'

export type InventoryEntries = {
  invEntryId: string
  invEntryTranId: string
  invEntryTotalPrice: number
  invEntryDate: Date
  invEntryVdId: string
  invEntryCustId: string
  invEntryType: 'INCOMING' | 'OUTGOING'
  transaction: Transactions
  inventory: Inventories
  customer: Customer
  vendor: Vendor
  inventoryEntryProducts: Array<InventoryEntryProducts>
}

export const inventoryEntriesColumns: ColumnDef<InventoryEntries>[] = [
  {
    id: 'expander',
    header: () => null,
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <button
          {...{
            onClick: row.getToggleExpandedHandler(),
            style: { cursor: 'pointer' },
          }}
        >
          {row.getIsExpanded() ? '👇' : '👉'}
        </button>
      ) : (
        '🔵'
      )
    },
  },
  {
    accessorKey: 'invEntryDate',
    meta: 'Entry Date',
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
          Date
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: InventoryEntryDateColumn,
  },
  {
    accessorKey: 'invEntryTotalPrice',
    meta: 'Total Price',
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
    cell: InventoryEntryAccountColumn,
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

    cell: InventoryEntryPartnerColumn,
  },
]
