import { CellContext } from '@tanstack/react-table'
import { Payrolls } from '../table-columns/payrolls.columns'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { EyeOff, MoreHorizontal } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export const EmployeeNameColumn = ({ row }: CellContext<Payrolls, unknown>) => {
  return (
    <div className="flex gap-4 min-w-32 items-center">
      <div>
        <Avatar>
          <AvatarImage src={'https://github.com/nestortion.png'} />
          <AvatarFallback>NG</AvatarFallback>
        </Avatar>
      </div>
      <div>{row.original.prEmpName}</div>
    </div>
  )
}

export const TotalDeductionColumn = ({
  row,
}: CellContext<Payrolls, unknown>) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(parseInt(row.getValue('prTotalDeduction')))

  return formatted
}

export const FinalAmountColumn = ({ row }: CellContext<Payrolls, unknown>) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(parseInt(row.getValue('prFinalAmount')))

  return (
    <div className="flex justify-between">
      <div>{formatted}</div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Payroll Details</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex justify-between">
              Hide <EyeOff />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
