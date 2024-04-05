import { CellContext } from '@tanstack/react-table'
import { Cheques } from '../table-columns/cheques.columns'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Text } from '../ui/text'

export const IssueDateColumn = ({ row }: CellContext<Cheques, unknown>) => {
  return new Date(row.original.chqIssueDate).toLocaleDateString()
}

export const PayeeNameColumn = ({ row }: CellContext<Cheques, unknown>) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(parseInt(row.getValue('chqAmount')))

  return formatted
}

export const CreatedAtColumn = ({ row }: CellContext<Cheques, unknown>) => {
  return new Date(row.original.chqCreatedAt).toLocaleDateString()
}

export const AccountColumn = ({ row }: CellContext<Cheques, unknown>) => {
  return (
    <div className="flex justify-between">
      <div>{row.original.account.accType}</div>
      <div>
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
                  navigator.clipboard.writeText(row.original.account.accId)
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
}

export const UpdatedAtColumn = ({ row }: CellContext<Cheques, unknown>) => (
  <div className="flex justify-between">
    <div>{new Date(row.original.chqUpdatedAt).toLocaleDateString()}</div>
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
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.original.chqAccId)}
          >
            Copy Cheque ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View Cheque Details</DropdownMenuItem>
          <DropdownMenuItem>Update Cheque Details</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex justify-between">
            Hide <EyeOff />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
)
