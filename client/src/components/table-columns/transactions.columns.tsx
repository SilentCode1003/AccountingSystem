import { ColumnDef } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { MoreHorizontal } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Text } from '../ui/text'
import { Employees } from './employees.columns'

type Account = {
  accId: string
  accType: string
  accAmount: number
  accDescription: string
  accIsActive: boolean
  accCreatedAt: boolean
  accUpdatedAt: boolean
}

export type Vendor = {
  vdId: string
  vdName: string
  vdContactInfo: string
  vdEmail: string
  vdIsActive: string
}
export type Customer = {
  custId: string
  custName: string
  custAddress: string
  custContactInfo: string
  custEmail: string
  custIsActive: string
}

export type Transactions = {
  tranId: string
  tranAccId: string
  tranDescription: string
  tranAmount: number
  tranEmpId?: string
  tranCustId?: string
  tranVdId?: string
  tranTransactionDate: string
  tranCreatedAt: string
  tranUpdatedAt: string
  account: Account
  employee: Employees
  customer: Customer
  vendor: Vendor
}

export const transactionColumns: ColumnDef<Transactions>[] = [
  {
    accessorKey: 'tranId',
    header: () => 'Transaction ID',
    cell: ({ row }) => {
      return row.index + 1
    },
  },
  {
    accessorKey: 'tranAccId',
    header: () => 'Account',
    cell: ({ row }) => {
      return (
        <div className="flex justify-between">
          <div>{row.original.account.accType}</div>
          <div>
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    className="hover:cursor-pointer"
                    onClick={() =>
                      navigator.clipboard.writeText(row.original.tranAccId)
                    }
                  >
                    Copy Account ID
                  </DropdownMenuItem>
                  <DialogTrigger asChild>
                    <DropdownMenuItem className="hover:cursor-pointer">
                      View Account Details
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent className="rounded-md w-fit sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Account Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 sm:space-y-0">
                  <DialogDescription className="flex flex-col sm:items-center sm:flex-row">
                    <Text variant={'body'} className="w-full sm:w-[33%]">
                      Account Id
                    </Text>
                    <div className="flex-1">{row.original.account.accId}</div>
                  </DialogDescription>
                  <DialogDescription className="flex flex-col sm:items-center sm:flex-row">
                    <Text variant={'body'} className="w-full sm:w-[33%]">
                      Account Type
                    </Text>
                    <div className="flex-1">{row.original.account.accType}</div>
                  </DialogDescription>
                  <DialogDescription className="flex flex-col sm:items-center sm:flex-row">
                    <Text variant={'body'} className="w-full sm:w-[33%]">
                      Created At
                    </Text>
                    <div className="flex-1">
                      {row.original.account.accDescription}
                    </div>
                  </DialogDescription>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'tranAmount',
    header: () => 'Transaction Amount',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('tranAmount'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: 'Conducted',
    header: '',
  },
  {
    accessorKey: 'tranTransactionDate',
    header: 'Transaction Date',
    cell: ({ row }) => {
      const date = new Date(row.original.tranTransactionDate)

      return date.toLocaleDateString()
    },
  },
  {
    header: 'Transaction with',
    cell: ({ row }) => {
      let data: {
        id: string
        type: string
        name: string
        contactInfo: string
        email: string
        isActive?: string
        dateHired?: string
        address?: string
      }
      if (row.original.tranEmpId) {
        data = {
          id: row.original.employee.empId,
          type: 'employee',
          name: row.original.employee.empName,
          contactInfo: row.original.employee.empContactInfo,
          email: row.original.employee.empEmail,
          address: row.original.employee.empAddress,
        }
      } else if (row.original.tranCustId) {
        data = {
          id: row.original.customer.custId,
          type: 'customer',
          name: row.original.customer.custName,
          contactInfo: row.original.customer.custContactInfo,
          email: row.original.customer.custEmail,
          address: row.original.customer.custAddress,
        }
      } else {
        data = {
          id: row.original.vendor.vdId,
          type: 'vendor',
          name: row.original.vendor.vdName,
          contactInfo: row.original.vendor.vdContactInfo,
          email: row.original.vendor.vdEmail,
        }
      }
      return (
        <div className="flex justify-between">
          <div>{data.name}</div>
          <div>
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    className="hover:cursor-pointer"
                    onClick={() => navigator.clipboard.writeText(data.id)}
                  >
                    Copy ID
                  </DropdownMenuItem>
                  <DialogTrigger asChild>
                    <DropdownMenuItem className="hover:cursor-pointer">
                      View Details
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent className="rounded-md sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {(data.type === 'employee' && 'Employee Details') ||
                      (data.type === 'customer' && 'Customer Details') ||
                      (data.type === 'vendor' && 'Vendor Details')}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 sm:space-y-0">
                  <DialogDescription className="flex flex-col sm:items-center sm:flex-row">
                    <Text variant={'body'} className="w-full sm:w-[33%]">
                      Name
                    </Text>
                    <div className="flex-1">{data.name}</div>
                  </DialogDescription>
                  <DialogDescription className="flex flex-col sm:items-center sm:flex-row">
                    <Text variant={'body'} className="w-full sm:w-[33%]">
                      Email
                    </Text>
                    <div className="flex-1">{data.email}</div>
                  </DialogDescription>
                  <DialogDescription className="flex flex-col sm:items-center sm:flex-row">
                    <Text variant={'body'} className="w-full sm:w-[33%]">
                      Contact Info
                    </Text>
                    <div className="flex-1">{data.contactInfo}</div>
                  </DialogDescription>
                  {data.address && (
                    <DialogDescription className="flex flex-col sm:items-center sm:flex-row">
                      <Text variant={'body'} className="w-full sm:w-[33%]">
                        Address
                      </Text>
                      <div className="flex-1">{data.address}</div>
                    </DialogDescription>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )
    },
  },
]
