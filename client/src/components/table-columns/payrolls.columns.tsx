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
    header: 'Employee Name',
    cell: EmployeeNameColumn,
  },
  {
    accessorKey: 'prTotalDeduction',
    header: 'Total Deductions',
    cell: TotalDeductionColumn,
  },
  {
    accessorKey: 'prDateFrom',
    header: 'Date From',
  },
  {
    accessorKey: 'prDateTo',
    header: 'Date From',
  },
  {
    accessorKey: 'prFinalAmount',
    header: 'Final Amount',
    cell: FinalAmountColumn,
  },
]
