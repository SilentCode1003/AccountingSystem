import { ColumnDef } from '@tanstack/react-table'

import {
  AddressColumn,
  BirthdateColumn,
  DateHiredColumn,
  DateTerminatedColumn,
  NameColumn,
  SalaryColumn,
} from '../table-components/employees.tblcomp'
import { ArrowUpDownIcon } from 'lucide-react'
import { text } from '../ui/text'
import { Button } from '../ui/button'

export type Employees = {
  empId: string
  empName: string
  empContactInfo: string
  empAddress: string
  empEmail: string
  empDateHired: string
  empDateTerminated: string
  empImage: string
  empBirthdate: string
  empSalary: number
}

export const employeeColumns: ColumnDef<Employees>[] = [
  {
    accessorKey: 'empName',
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
    cell: NameColumn,
  },
  {
    accessorKey: 'empAddress',
    meta: 'Address',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Address
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: AddressColumn,
  },
  {
    accessorKey: 'empContactInfo',
    meta: 'Contact Info',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Contact Info
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'empEmail',
    meta: 'Email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Email
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'empBirthdate',
    filterFn: 'dateBetweenFilter',
    meta: 'Birthdate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Birthdate
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: BirthdateColumn,
  },
  {
    accessorKey: 'empDateHired',
    meta: 'Date Hired',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Date Hired
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: DateHiredColumn,
  },
  {
    accessorKey: 'empDateTerminated',
    meta: 'Date Terminated',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Date Terminated
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: DateTerminatedColumn,
  },
  {
    accessorKey: 'empSalary',
    meta: 'Salary',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Salary
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: SalaryColumn,
  },
]
