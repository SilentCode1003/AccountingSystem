import { ColumnDef } from '@tanstack/table-core'
import { ArrowUpDownIcon } from 'lucide-react'
import {
  ModeOfPaymentNameColumn,
  ModeOfPaymentStatusColumn,
} from '../table-components/modesOfPayment.tblcomp'
import { Button } from '../ui/button'
import { text } from '../ui/text'

export type ModesOfPayment = {
  mopId: string
  mopName: string
  mopIsActive: boolean
}

export const ModesOfPaymentColumns: ColumnDef<ModesOfPayment>[] = [
  {
    accessorKey: 'mopName',
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
          Mode of Payment Name
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    meta: 'Mode of Payment Name',
    cell: ModeOfPaymentNameColumn,
  },
  {
    accessorKey: 'mopIsActive',
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
    meta: 'Status',
    cell: ModeOfPaymentStatusColumn,
  },
]
