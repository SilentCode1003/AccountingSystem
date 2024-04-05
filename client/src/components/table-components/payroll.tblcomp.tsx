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
import { EyeOff, MoreHorizontal, MoreHorizontalIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Text } from '../ui/text'

export const EmployeeNameColumn = ({ row }: CellContext<Payrolls, unknown>) => {
  return (
    <div className="flex justify-between min-w-32 items-center">
      <div className="flex gap-4">
        <div>
          <Avatar>
            <AvatarImage src={'https://github.com/nestortion.png'} />
            <AvatarFallback>NG</AvatarFallback>
          </Avatar>
        </div>
        <div>{row.original.employee.empName}</div>
      </div>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() =>
                navigator.clipboard.writeText(row.original.employee.empId)
              }
            >
              Copy Employee ID
            </DropdownMenuItem>
            <DialogTrigger asChild>
              <DropdownMenuItem className="hover:cursor-pointer">
                View Employee Details
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent className="rounded-md w-fit sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{row.original.employee.empName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 sm:space-y-0">
            <DialogDescription className="flex flex-col sm:items-center sm:flex-row">
              <Text variant={'body'} className="w-full sm:w-[33%]">
                ID
              </Text>
              <div className="flex-1">{row.original.employee.empId}</div>
            </DialogDescription>
            <DialogDescription className="flex flex-col sm:items-center sm:flex-row">
              <Text variant={'body'} className="w-full sm:w-[33%]">
                Address
              </Text>
              <div className="flex-1">{row.original.employee.empAddress}</div>
            </DialogDescription>
            <DialogDescription className="flex flex-col sm:items-center sm:flex-row">
              <Text variant={'body'} className="w-full sm:w-[33%]">
                Contact Info
              </Text>
              <div className="flex-1">
                {row.original.employee.empContactInfo}
              </div>
            </DialogDescription>
            <DialogDescription className="flex flex-col sm:items-center sm:flex-row">
              <Text variant={'body'} className="w-full sm:w-[33%]">
                Email
              </Text>
              <div className="flex-1">{row.original.employee.empEmail}</div>
            </DialogDescription>
            <DialogDescription className="flex flex-col sm:items-center sm:flex-row">
              <Text variant={'body'} className="w-full sm:w-[33%]">
                Birthdate
              </Text>
              <div className="flex-1">
                {new Date(
                  row.original.employee.empBirthdate,
                ).toLocaleDateString()}
              </div>
            </DialogDescription>
            <DialogDescription className="flex flex-col sm:items-center sm:flex-row">
              <Text variant={'body'} className="w-full sm:w-[33%]">
                Date Hired
              </Text>
              <div className="flex-1">
                {new Date(
                  row.original.employee.empDateHired,
                ).toLocaleDateString()}
              </div>
            </DialogDescription>
            <DialogDescription className="flex flex-col sm:items-center sm:flex-row">
              <Text variant={'body'} className="w-full sm:w-[33%]">
                Date Terminated
              </Text>
              <div className="flex-1">
                {new Date(
                  row.original.employee.empDateTerminated,
                ).toLocaleDateString()}
              </div>
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export const DateFromColumn = ({ row }: CellContext<Payrolls, unknown>) => {
  return new Date(row.original.prDateFrom).toLocaleDateString()
}

export const DateToColumn = ({ row }: CellContext<Payrolls, unknown>) => {
  return new Date(row.original.prDateTo).toLocaleDateString()
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
