import { ColumnDef } from '@tanstack/react-table'

import {
  DateFromColumn,
  DateToColumn,
  EmployeeNameColumn,
  FinalAmountColumn,
  TotalDeductionColumn,
} from '../table-components/payroll.tblcomp'
import { Button } from '../ui/button'
import { text } from '../ui/text'
import { ArrowUpDownIcon } from 'lucide-react'
import { Employees } from './employees.columns'

export type Payrolls = {
  prId: string
  prEmpName: string
  prTotalDeduction: number
  prDateFrom: string
  prDateTo: string
  prFinalAmount: number
  employee: Employees
  prTranId: string
}

export const payrollColumns: ColumnDef<Payrolls>[] = [
  {
    accessorKey: 'prEmpName',
    meta: 'Employee Name',
    accessorFn: (row) => {
      return row.employee.empName
    },
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
          Employee Name
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: EmployeeNameColumn,
  },
  {
    accessorKey: 'prTotalDeduction',
    accessorFn: (row) => Number(row.prTotalDeduction),
    meta: 'Total Deductions',
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
          className={text({
            variant: 'bodybold',
            className: 'p-0 text-foreground',
          })}
        >
          Date From
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: DateFromColumn,
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
          className={text({
            variant: 'bodybold',
            className: 'p-0 text-foreground',
          })}
        >
          Date To
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: DateToColumn,
  },
  {
    accessorKey: 'prFinalAmount',
    accessorFn: (row) => Number(row.prFinalAmount),
    meta: 'Final Amount',
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
          Final Amount
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: FinalAmountColumn,
  },
]
