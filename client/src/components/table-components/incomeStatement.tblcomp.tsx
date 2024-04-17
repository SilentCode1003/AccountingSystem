import { CellContext } from '@tanstack/react-table'
import { Expense, Revenue } from '../table-columns/incomeStatement.columns'

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