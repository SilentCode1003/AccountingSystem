import { CellContext } from '@tanstack/react-table'
import { Accounts } from '../table-columns/accounts.columns'

export const AccountIsActiveColumn = ({
  row,
}: CellContext<Accounts, unknown>) => {
  return row.original.accIsActive ? 'Active' : 'Inactive'
}

export const AccountAmountColumn = ({
  row,
}: CellContext<Accounts, unknown>) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(row.original.accAmount)
  return formatted
}
