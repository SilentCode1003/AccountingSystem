import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDownIcon } from 'lucide-react'
import { AccountTypeNameColumn } from '../table-components/accountTypes.tblcomp'
import { Button } from '../ui/button'
import { text } from '../ui/text'
import { Accounts } from './accounts.columns'

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
    meta: 'accTypeName',
  },
  // {
  //   accessorKey: 'accounts',
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //         className={text({
  //           variant: 'bodybold',
  //           className: 'p-0 text-foreground',
  //         })}
  //       >
  //         accounts
  //         <ArrowUpDownIcon className="ml-2 h-4 w-4" />
  //       </Button>
  //     )
  //   },
  //   meta: 'accTypeDefault',
  //   cell: AccountTypeAccountsColumn,
  // },
]
