import { useToggleUser } from '@/hooks/mutations'
import { cn } from '@/lib/utils'
import { CellContext } from '@tanstack/react-table'
import { MoreHorizontalIcon } from 'lucide-react'
import { PromptModal } from '../PromptModal'
import { Users } from '../table-columns/users.columns'
import { AlertDialog, AlertDialogTrigger } from '../ui/alert-dialog'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

export const UserIsActiveColumn = ({ row }: CellContext<Users, unknown>) => {
  const toggleUser = useToggleUser()

  return (
    <div className="flex justify-between items-center">
      <Badge
        className={cn(
          row.original.userIsActive ? 'bg-emerald-500' : 'bg-rose-500',
          'hover:bg-gray-500 text-center',
        )}
      >
        {row.original.userIsActive ? 'Active' : 'Inactive'}
      </Badge>
      <div>
        <AlertDialog>
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
                onClick={() =>
                  navigator.clipboard.writeText(row.original.userUsername)
                }
              >
                Copy Username
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>Toggle User Status</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <PromptModal
            callback={() =>
              toggleUser.mutate({
                userId: row.original.userId,
              })
            }
            nonButton
            dialogMessage="Continue?"
            prompType="TOGGLE"
            dialogTitle="You are about to toggle this user! Data change may occur and cannot be undone!"
            triggerText="TOGGLE USER"
          />
        </AlertDialog>
      </div>
    </div>
  )
}
