import { CellContext } from '@tanstack/react-table'
import { Asset, Liability } from '../table-columns/balanceSheet.columns'

export const AssetAmountColumn = ({ row }: CellContext<Asset, unknown>) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(row.original.amount)
  return formatted
}

export const LiabilityAmountColumn = ({
  row,
}: CellContext<Liability, unknown>) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(row.original.amount)
  return formatted
}
