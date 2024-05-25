import {
  useToggleModeOfPayment,
  useUpdateModeOfPayment,
} from '@/hooks/mutations'
import { updateModeOfPaymentSchema } from '@/validators/modesOfPayment.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { CellContext } from '@tanstack/react-table'
import { MoreHorizontalIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { PromptModal } from '../PromptModal'
import { ModesOfPayment } from '../table-columns/modesOfPayment.columns'
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

export const ModeOfPaymentNameColumn = ({
  row,
}: CellContext<ModesOfPayment, unknown>) => {
  return (
    <div className="flex justify-between items-center">
      <Badge variant={'secondary'}>{row.original.mopName}</Badge>
    </div>
  )
}

export const ModeOfPaymentStatusColumn = ({
  row,
}: CellContext<ModesOfPayment, unknown>) => {
  const [open, setOpen] = useState<boolean>(false)

  const form = useForm({
    defaultValues: {
      mopId: row.original.mopId,
      newData: {
        mopName: row.original.mopName,
      },
    },
    resolver: zodResolver(updateModeOfPaymentSchema),
  })

  const updateModeOfPayment = useUpdateModeOfPayment({ setOpen })

  const toggleModeOfPaymentIsActive = useToggleModeOfPayment()

  const handleSubmit = (values: z.infer<typeof updateModeOfPaymentSchema>) => {
    updateModeOfPayment.mutate(values)
  }
  return (
    <div className="flex justify-between items-center">
      {row.original.mopIsActive ? (
        <Badge className="bg-emerald-500">Active</Badge>
      ) : (
        <Badge className="bg-rose-500">Inactive</Badge>
      )}
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
                    navigator.clipboard.writeText(row.original.mopId)
                  }
                >
                  Copy Mode of Payment ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DialogTrigger asChild>
                  <DropdownMenuItem>Update Mode of Payment</DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>Toggle is active</DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <PromptModal
              callback={() =>
                toggleModeOfPaymentIsActive.mutate({
                  mopId: row.original.mopId,
                })
              }
              nonButton
              dialogMessage="Continue?"
              prompType="DELETE"
              dialogTitle="You are about to Toggle this mode of payment!"
              triggerText="TOGGLE MODE OF PAYMENT"
            />

            <DialogContent className="scale-75 md:scale-100">
              <DialogHeader>
                <DialogTitle>
                  <Text variant="heading3bold">Update Mode Of Payment</Text>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-4 overflow-y-auto max-h-96">
                        <FormField
                          control={form.control}
                          name="mopId"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Mode of Payment ID</FormLabel>
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
                          name="newData.mopName"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Mode of Payment Name</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  className="w-full"
                                  placeholder="Mode of Payment Name"
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
                    dialogTitle="You are about to update this mode of payment"
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
