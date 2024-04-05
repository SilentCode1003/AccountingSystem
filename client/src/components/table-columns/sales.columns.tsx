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
    meta: 'Date Sold',
    header: () => 'Date Sold',
  },
  {
    accessorKey: 'productCode',
    meta: 'Product Code',
    header: () => 'Product Code',
  },
  {
    accessorKey: 'productName',
    meta: 'Product Name',
    header: () => 'Product Name',
  },
  {
    accessorKey: 'pricePerUnit',
    meta: 'Price Per Unit',
    header: () => <div className="">Price Per Unit</div>,
    cell: PricePerUnitColumn,
  },

  {
    accessorKey: 'unitsSold',
    meta: 'Units Sold',
    header: 'Units Sold',
  },
  {
    accessorKey: 'total',
    meta: 'Total',
    header: 'Total',
    cell: TotalColumn,
  },
]
