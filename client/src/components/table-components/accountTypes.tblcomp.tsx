import { useDeleteAccountType, useUpdateAccountType } from '@/hooks/mutations'
import { useAccountTypes } from '@/hooks/queries'
import { updateAccountTypeSchema } from '@/validators/accountTypes.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { CellContext } from '@tanstack/react-table'
import { MoreHorizontalIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AccountTypes } from '../table-columns/accountTypes.column'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/Form'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Text } from '../ui/text'
import { AlertDialog, AlertDialogTrigger } from '../ui/alert-dialog'
import { PromptModal } from '../PromptModal'
import { useState } from 'react'

export const AccountTypeAccountsColumn = ({
  row,
}: CellContext<AccountTypes, unknown>) => {
  const [open, setOpen] = useState<boolean>(false)
  const accountTypes = useAccountTypes()

  const form = useForm({
    defaultValues: {
      accTypeId: row.original.accTypeId,
      newData: {
        accTypeName: row.original.accTypeName,
        accTypeDefault: row.original.accTypeDefault,
      },
    },
    resolver: zodResolver(updateAccountTypeSchema),
  })

  const updateAccountType = useUpdateAccountType({ setOpen })

  const deleteAccountType = useDeleteAccountType()

  const handleSubmit = (values: z.infer<typeof updateAccountTypeSchema>) => {
    updateAccountType.mutate(values)
  }

  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-4">
        {row.original.accounts.length > 0 ? (
          row.original.accounts.map((acc) => (
            <div key={acc.accId}>{acc.accName}</div>
          ))
        ) : (
          <div>No Accounts</div>
        )}
      </div>

      <div>
        <AlertDialog>
          <Dialog open={open} onOpenChange={setOpen}>
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
                    navigator.clipboard.writeText(row.original.accTypeId)
                  }
                >
                  Copy Account Type ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DialogTrigger asChild>
                  <DropdownMenuItem>Update Account Type</DropdownMenuItem>
                </DialogTrigger>

                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>Delete Account Type</DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <PromptModal
              callback={() =>
                deleteAccountType.mutate({
                  accTypeId: row.original.accTypeId,
                })
              }
              nonButton
              dialogMessage="Continue?"
              prompType="DELETE"
              dialogTitle="You are about to DELETE this account type! Data loss may occur and cannot be undone!"
              triggerText="DELETE ACCOUNT TYPE"
            />

            <DialogContent className="scale-75 md:scale-100">
              <DialogHeader>
                <DialogTitle>
                  <Text variant="heading3bold">Update Account</Text>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-4 overflow-y-auto max-h-96">
                        <FormField
                          control={form.control}
                          name="accTypeId"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Account ID</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input disabled className="w-full" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="newData.accTypeName"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Account Type Name</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  className="w-full"
                                  placeholder="Account Name"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          name="newData.accTypeDefault"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <div className="flex items-center justify-between">
                                <FormLabel>Account Type Statement</FormLabel>
                              </div>
                              <FormControl>
                                {accountTypes.isSuccess && (
                                  <Select
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Account type default" />
                                    </SelectTrigger>
                                    <SelectContent className="flex-1">
                                      <SelectItem value="INCOMESTATEMENT">
                                        Income Statement
                                      </SelectItem>
                                      <SelectItem value="BALANCESHEET">
                                        Balance Sheet
                                      </SelectItem>
                                      <SelectItem value="CASHFLOW">
                                        Cash Flow
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </form>
                </Form>
                <div className="flex justify-between">
                  <PromptModal
                    dialogMessage="Continue?"
                    prompType="UPDATE"
                    dialogTitle="You are about to update this account type"
                    triggerText="Update"
                    callback={form.handleSubmit(handleSubmit)}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant={'secondary'}
                      onClick={() => {
                        form.clearErrors()
                        form.reset()
                      }}
                    >
                      Clear
                    </Button>
                    <DialogClose asChild>
                      <Button variant={'outline'}>Cancel</Button>
                    </DialogClose>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </AlertDialog>
      </div>
    </div>
  )
}
