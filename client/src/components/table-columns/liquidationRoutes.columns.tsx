import { ColumnDef } from '@tanstack/table-core'
import { Liquidations } from './liquidations.columns'

export type LiquidationRoutes = {
  lrId: string
  lrDestination: string
  lrLiqId: string
  lrFrom: string
  lrTo: string
  lrPrice: number
  lrModeOfTransport: string
  liquidation?: Liquidations
}

export const liquidationsRoutesColumns: ColumnDef<LiquidationRoutes>[] = [
  {
    accessorKey: 'lrDestination',
    meta: 'Destination',
    header: () => 'Destination',
  },
  {
    accessorKey: 'lrFrom',
    meta: 'From',
    header: () => 'From',
  },
  {
    accessorKey: 'lrTo',
    meta: 'To',
    header: () => 'To',
  },
  {
    accessorKey: 'lrPrice',
    meta: 'Price',
    header: () => 'Price',
    cell: ({ row }) => {
      const amount = parseFloat(String(row.original.lrPrice))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: 'lrModeOfTransport',
    meta: 'Mode of Transport',
    header: () => 'Mode of Transport',
  },
]
