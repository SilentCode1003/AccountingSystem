import { ColumnDef } from '@tanstack/react-table'
import { Button } from '../ui/button'
import { text } from '../ui/text'
import { ArrowUpDownIcon } from 'lucide-react'
import {
  AccountAccountTypeColumn,
  AccountAmountColumn,
  AccountIsActiveColumn,
  AccountNameColumn,
} from '../table-components/accounts.tblcomp'

export type Accounts = {
  accId: string
  accName: string
  accTypeId: string
  accDescription: string
  accAmount: number
  accIsActive: boolean
  accCreatedAt: string
  accUpdatedAt: string
  accountType: {
    accTypeId: string
    accTypeName: string
    accTypeDefault: string
  }
}

export const accountsColumns: ColumnDef<Accounts>[] = [
  {
    accessorKey: 'accName',
    meta: 'Account Name',
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
          Account Name
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: AccountNameColumn,
  },
  {
    accessorKey: 'accAmount',
    meta: 'Amount',
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
          Amount
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: AccountAmountColumn,
  },
  {
    accessorKey: 'accountType',
    accessorFn: (row) => row.accountType.accTypeName,
    meta: 'Account Type',
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
          Account Type
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: AccountAccountTypeColumn,
  },
  {
    accessorKey: 'accDescription',
    meta: 'Description',
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
          Description
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'accIsActive',
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
    cell: AccountIsActiveColumn,
  },
]
