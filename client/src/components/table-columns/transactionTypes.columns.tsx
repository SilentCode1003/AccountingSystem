import { ArrowUpDownIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { text } from '../ui/text'
import { Transactions } from './transactions.columns'
import { ColumnDef } from '@tanstack/table-core'
import {
  TranTypeNameColumn,
  TranTypeTransactionsColumn,
} from '../table-components/transactionTypes.tblcomp'

export type TransactionTypes = {
  tranTypeId: string
  tranTypeName: string
  transactions: Array<Transactions>
}

export const TransactionTypeColumns: ColumnDef<TransactionTypes>[] = [
  {
    accessorKey: 'tranTypeName',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Transaction Type Name
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: TranTypeNameColumn,
    meta: 'tranTypeName',
  },
  {
    accessorKey: 'transactions',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Transactions
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    meta: 'Transactions',
    cell: TranTypeTransactionsColumn,
  },
]
