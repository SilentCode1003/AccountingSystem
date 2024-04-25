import { ColumnDef } from '@tanstack/react-table'
import { Button } from '../ui/button'
import { text } from '../ui/text'
import { ArrowUpDownIcon } from 'lucide-react'
import { Accounts } from './accounts.columns'
import {
  AccountTypeAccountsColumn,
  AccountTypeNameColumn,
} from '../table-components/accountTypes.tblcomp'

export type AccountTypes = {
  accTypeId: string
  accTypeName: string
  accTypeDefault: string
  accounts: Array<Accounts>
}

export const accountTypeColumn: ColumnDef<AccountTypes>[] = [
  {
    accessorKey: 'accTypeName',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Account Type Name
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: AccountTypeNameColumn,
    meta: 'accTypeName',
  },
  {
    accessorKey: 'accounts',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          accounts
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    meta: 'accTypeDefault',
    cell: AccountTypeAccountsColumn,
  },
]
