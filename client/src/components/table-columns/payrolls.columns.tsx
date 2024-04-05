import { ColumnDef } from '@tanstack/react-table'

import {
  EmployeeNameColumn,
  FinalAmountColumn,
  TotalDeductionColumn,
} from '../table-components/payroll.tblcomp'

export type Payrolls = {
  prEmpName: string
  prTotalDeduction: number
  prDateFrom: string
  prDateTo: string
  prFinalAmount: number
}

export const payrollColumns: ColumnDef<Payrolls>[] = [
  {
    accessorKey: 'empName',
    meta: 'Employee Name',
    header: 'Employee Name',
    cell: EmployeeNameColumn,
  },
  {
    accessorKey: 'prTotalDeduction',
    meta: 'Total Deductions',
    header: 'Total Deductions',
    cell: TotalDeductionColumn,
  },
  {
    accessorKey: 'prDateFrom',
    meta: 'Date From',
    header: 'Date From',
  },
  {
    accessorKey: 'prDateTo',
    meta: 'Date To',
    header: 'Date To',
  },
  {
    accessorKey: 'prFinalAmount',
    meta: 'Final Amount',
    header: 'Final Amount',
    cell: FinalAmountColumn,
  },
]
