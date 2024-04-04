import { ColumnDef } from '@tanstack/react-table'

import {
  PricePerUnitColumn,
  TotalColumn,
} from '../table-components/sales.tblcomp'

export type Sales = {
  id: string
  productCode: string
  productName: string
  dateSold: string
  unitsSold: number
  pricePerUnit: number
  total: number
}

export const salesColumns: ColumnDef<Sales>[] = [
  {
    accessorKey: 'dateSold',
    header: () => 'Date Sold',
  },
  {
    accessorKey: 'productCode',
    header: () => 'Product Code',
  },
  {
    accessorKey: 'productName',
    header: () => 'Product Name',
  },
  {
    accessorKey: 'pricePerUnit',
    header: () => <div className="">Price Per Unit</div>,
    cell: PricePerUnitColumn,
  },

  {
    accessorKey: 'unitsSold',
    header: 'Units Sold',
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: TotalColumn,
  },
]
