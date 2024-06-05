import { ColumnDef } from '@tanstack/table-core'
import { ArrowUpDownIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { text } from '../ui/text'
import { Employees } from './employees.columns'

export type EmployeeLiquidations = {
  employee: Pick<Employees, 'empId' | 'empName'>
  amount: number
}

export const employeeLiquidationsColumns: ColumnDef<EmployeeLiquidations>[] = [
  {
    accessorKey: 'employee',
    accessorFn: (row) => row.employee.empName,
    meta: 'Employee',
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
          Employee
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    // cell: ({ row }) => new Date(row.original.liquidationDate).toLocaleDateString(),
  },
  {
    accessorKey: 'amount',
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
          Accumulated Liquidation
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(String(row.original.amount))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
      }).format(amount)
      return formatted
    },
  },
  //   {
  //     accessorKey: 'liquidationEmpId',
  //     accessorFn: (row) => row.employee.empName,
  //     meta: 'Employee',
  //     header: ({ column }) => {
  //       return (
  //         <Button
  //           variant="ghost"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //           className={text({
  //             variant: 'bodybold',
  //             className: 'p-0 text-foreground',
  //           })}
  //         >
  //           Employee
  //           <ArrowUpDownIcon className="ml-2 h-4 w-4" />
  //         </Button>
  //       )
  //     },
  //     // cell: InventoryEntryTypeColumn,
  //   },
]
