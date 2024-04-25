import { CellContext } from '@tanstack/react-table'
import { Asset, Liability } from '../table-columns/balanceSheet.columns'
import { Badge } from '../ui/badge'

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

export const BalanceSheetAccountNameColumn = ({
  row,
}: CellContext<Asset, unknown>) => {
  return <Badge variant={'outline'}>{row.original.accName}</Badge>
}
