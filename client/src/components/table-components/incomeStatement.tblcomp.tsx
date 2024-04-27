import { CellContext } from '@tanstack/react-table'
import { Expense, Revenue } from '../table-columns/incomeStatement.columns'
import { Asset } from '../table-columns/balanceSheet.columns'
import { Badge } from '../ui/badge'

export const RevenueAmountColumn = ({ row }: CellContext<Revenue, unknown>) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(row.original.amount)
  return formatted
}

export const ExpenseAmountColumn = ({ row }: CellContext<Expense, unknown>) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(row.original.amount)
  return formatted
}

export const IncomeStatementAccountNameColumn = ({
  row,
}: CellContext<Asset, unknown>) => {
  return <Badge variant={'outline'}>{row.original.accName}</Badge>
}
