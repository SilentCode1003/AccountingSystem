import { ColumnDef } from '@tanstack/table-core'
import { Inventories } from './inventory.columns'

export type InventoryEntryProducts = {
  iepId: string
  iepInvId: string
  iepInvEntryId: string
  iepQuantity: string
  iepTotalPrice: string
  inventory: Inventories
}

export const inventoryEntryProductsColumns: ColumnDef<InventoryEntryProducts>[] =
  [
    {
      accessorKey: 'inventory',
      accessorFn: (row) => row.inventory.invAssetName,
      meta: 'Inventory Name',
      header: () => 'Inventory Name',
    },
    {
      accessorKey: 'iepPricePerUnit',
      meta: 'Price Per Unit',
      header: () => 'Price Per Unit',
      cell: ({ row }) => {
        const amount = parseFloat(
          String(row.original.inventory.invPricePerUnit),
        )
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'PHP',
        }).format(amount)
        return formatted
      },
    },
    {
      accessorKey: 'iepQuantity',
      meta: 'Quantity',
      header: () => 'Quantity',
    },
    {
      accessorKey: 'iepTotalPrice',
      meta: 'Total Price',
      header: () => 'Total Price',
      cell: ({ row }) => {
        const amount = parseFloat(String(row.original.iepTotalPrice))
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'PHP',
        }).format(amount)
        return formatted
      },
    },
  ]
