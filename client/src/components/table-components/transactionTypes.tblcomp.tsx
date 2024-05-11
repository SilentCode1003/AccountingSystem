import { updateTransactionTypeSchema } from '@/validators/transactionTypes.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { CellContext } from '@tanstack/react-table'
import { MoreHorizontalIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { PromptModal } from '../PromptModal'
import { TransactionTypes } from '../table-columns/transactionTypes.columns'
import { AlertDialog, AlertDialogTrigger } from '../ui/alert-dialog'
import { Badge } from '../ui/badge'
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
import { Text } from '../ui/text'
import {
  useDeleteTransactionType,
  useUpdateTransactionType,
} from '@/hooks/mutations'

export const TranTypeNameColumn = ({
  row,
}: CellContext<TransactionTypes, unknown>) => {
  return <Badge variant={'secondary'}>{row.original.tranTypeName}</Badge>
}

export const TranTypeTransactionsColumn = ({
  row,
}: CellContext<TransactionTypes, unknown>) => {
  const [open, setOpen] = useState<boolean>(false)

  const form = useForm({
    defaultValues: {
      tranTypeId: row.original.tranTypeId,
      newData: {
        tranTypeName: row.original.tranTypeName,
      },
    },
    resolver: zodResolver(updateTransactionTypeSchema),
  })

  const updateTranType = useUpdateTransactionType({ setOpen })

  const deleteTransactionType = useDeleteTransactionType()

  const handleSubmit = (
    values: z.infer<typeof updateTransactionTypeSchema>,
  ) => {
    updateTranType.mutate(values)
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col gap-4">
        {row.original.transactions.length > 0 ? (
          row.original.transactions.map((tran) => (
            <Badge
              variant={'outline'}
              className="w-fit whitespace-nowrap"
              key={tran.tranId}
            >
              {tran.tranDescription}
            </Badge>
          ))
        ) : (
          <div>No Result</div>
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
                    navigator.clipboard.writeText(row.original.tranTypeId)
                  }
                >
                  Copy Transaction Type ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DialogTrigger asChild>
                  <DropdownMenuItem>Update Transaction Type</DropdownMenuItem>
                </DialogTrigger>

                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>Delete Transaction Type</DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <PromptModal
              callback={() =>
                deleteTransactionType.mutate({
                  tranTypeId: row.original.tranTypeId,
                })
              }
              nonButton
              dialogMessage="Continue?"
              prompType="DELETE"
              dialogTitle="You are about to DELETE this transaction type! Data loss may occur and cannot be undone!"
              triggerText="DELETE TRANSACTION TYPE"
            />

            <DialogContent className="scale-75 md:scale-100">
              <DialogHeader>
                <DialogTitle>
                  <Text variant="heading3bold">Update Transaction Type</Text>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-4 overflow-y-auto max-h-96">
                        <FormField
                          control={form.control}
                          name="tranTypeId"
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
                          name="newData.tranTypeName"
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
                      </div>
                    </div>
                  </form>
                </Form>
                <div className="flex justify-between">
                  <PromptModal
                    dialogMessage="Continue?"
                    prompType="UPDATE"
                    dialogTitle="You are about to update this transaction type"
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
