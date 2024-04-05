import { ColumnDef } from '@tanstack/react-table'

import {
  EmployeeNameColumn,
  FinalAmountColumn,
  TotalDeductionColumn,
} from '../table-components/payroll.tblcomp'
import { Button } from '../ui/button'
import { text } from '../ui/text'
import { ArrowUpDownIcon } from 'lucide-react'

export type Payrolls = {
  prEmpName: string
  prTotalDeduction: number
  prDateFrom: string
  prDateTo: string
  prFinalAmount: number
}

export const payrollColumns: ColumnDef<Payrolls>[] = [
  {
    accessorKey: 'prEmpName',
    meta: 'Employee Name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Employee Name
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: EmployeeNameColumn,
  },
  {
    accessorKey: 'prTotalDeduction',
    meta: 'Total Deductions',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Total Deductions
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: TotalDeductionColumn,
  },
  {
    accessorKey: 'prDateFrom',
    filterFn: 'dateBetweenFilter',
    meta: 'Date From',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Date From
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'prDateTo',
    filterFn: 'dateBetweenFilter',
    meta: 'Date To',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Date To
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'prFinalAmount',
    meta: 'Final Amount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Final Amount
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: FinalAmountColumn,
  },
]
