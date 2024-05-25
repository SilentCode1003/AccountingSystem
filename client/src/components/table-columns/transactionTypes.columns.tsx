import { ColumnDef } from '@tanstack/table-core'
import { ArrowUpDownIcon } from 'lucide-react'
import {
  TranTypeAccountTypeColumn,
  TranTypeNameColumn,
} from '../table-components/transactionTypes.tblcomp'
import { Button } from '../ui/button'
import { text } from '../ui/text'
import { AccountTypes } from './accountTypes.column'
import { Badge } from '../ui/badge'

export type TransactionTypes = {
  tranTypeId: string
  tranTypeName: string
  tranTypeAccTypeId: string
  accountType: AccountTypes
  tranTypeIsActive: boolean
}

export const TransactionTypeColumns: ColumnDef<TransactionTypes>[] = [
  {
    accessorKey: 'tranTypeName',
    meta: 'Transaction Type',
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
          Transaction Type Name
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: TranTypeNameColumn,
  },
  {
    accessorKey: 'tranTypeIsActive',
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
    cell: ({ row }) => {
      return (
        <>
          {row.original.tranTypeIsActive ? (
            <Badge className="bg-emerald-500">Active</Badge>
          ) : (
            <Badge className="bg-rose-500">Inactive</Badge>
          )}
        </>
      )
    },
  },
  {
    accessorKey: 'tranTypeAccTypeId',
    meta: 'Account Type',
    accessorFn: (row) => row.accountType.accTypeName,
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
    cell: TranTypeAccountTypeColumn,
  },
]
