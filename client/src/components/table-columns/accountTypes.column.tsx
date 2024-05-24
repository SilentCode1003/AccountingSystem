import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDownIcon } from 'lucide-react'
import {
  AccountTypeNameColumn,
  AccountTypeStatusColumn,
} from '../table-components/accountTypes.tblcomp'
import { Button } from '../ui/button'
import { text } from '../ui/text'
import { Accounts } from './accounts.columns'
import { TransactionTypes } from './transactionTypes.columns'

export type AccountTypes = {
  accTypeId: string
  accTypeName: string
  accTypeDefault: string
  accTypeIsProfit: boolean
  accTypeIsActive: boolean
  accounts: Array<Accounts>
  transactionTypes: Array<TransactionTypes>
}

export const accountTypeColumn: ColumnDef<AccountTypes>[] = [
  {
    accessorKey: 'accTypeName',
    meta: 'Account Type Name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({
            variant: 'bodybold',
            className: 'p-0 text-foreground',
          })}
        >
          Account Type Name
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: AccountTypeNameColumn,
  },
  {
    accessorKey: 'accTypeIsActive',
    accessorFn: (row) => (row.accTypeIsActive ? 'Active' : 'Inactive'),
    meta: 'Status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({
            variant: 'bodybold',
            className: 'p-0 text-foreground',
          })}
        >
          Status
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: AccountTypeStatusColumn,
  },
]
