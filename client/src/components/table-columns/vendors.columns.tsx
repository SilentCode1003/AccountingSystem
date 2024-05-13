import { ColumnDef } from '@tanstack/table-core'
import { Button } from '../ui/button'
import { text } from '../ui/text'
import { ArrowUpDownIcon } from 'lucide-react'
import { VendorEmailColumn } from '../table-components/vendors.tblcomp'

export type Vendors = {
  vdId: string
  vdName: string
  vdAddress: string
  vdContactInfo: string
  vdEmail: string
  vdIsActive: boolean
}

export const vendorColumns: ColumnDef<Vendors>[] = [
  {
    accessorKey: 'vdName',
    meta: 'Vendor Name',
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
          Vendor Name
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'vdAddress',
    meta: 'Vendor Address',
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
          Vendor Address
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'vdContactInfo',
    meta: 'Vendor Contact Info',
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
          Vendor Contact Info
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'vdEmail',
    meta: 'Vendor Email',
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
          Vendor Email
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: VendorEmailColumn,
  },
]
