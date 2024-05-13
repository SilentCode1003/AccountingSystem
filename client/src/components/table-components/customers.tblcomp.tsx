import { useUpdateCustomer } from '@/hooks/mutations'
import { updateCustomersSchema } from '@/validators/customers.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { CellContext } from '@tanstack/table-core'
import { MoreHorizontalIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { PromptModal } from '../PromptModal'
import { Customers } from '../table-columns/customers.columns'
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

export const CustomerEmailColumn = ({
  row,
}: CellContext<Customers, unknown>) => {
  const [open, setOpen] = useState<boolean>(false)
  const form = useForm({
    defaultValues: {
      custId: row.original.custId,
      newData: {
        custName: row.original.custName,
        custAddress: row.original.custAddress,
        custContactInfo: row.original.custContactInfo,
        custEmail: row.original.custEmail,
      },
    },
    resolver: zodResolver(updateCustomersSchema),
  })

  const updateCustomer = useUpdateCustomer({ setOpen, cell: { row } })

  const handleSubmit = (values: z.infer<typeof updateCustomersSchema>) => {
    updateCustomer.mutate(values)
  }

  return (
    <div className="flex justify-between items-center">
      <div>{row.original.custEmail}</div>
      <div>
        <Dialog>
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
                    navigator.clipboard.writeText(row.original.custId)
                  }
                >
                  Copy Customer ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DialogTrigger asChild>
                  <DropdownMenuItem>Update Customer</DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="scale-75 md:scale-100">
              <DialogHeader>
                <DialogTitle>
                  <Text variant="heading3bold">Update Customer</Text>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-4 overflow-y-auto max-h-96">
                        <FormField
                          control={form.control}
                          name="custId"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Customer ID</FormLabel>
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
                          name="newData.custName"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Customer Name</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  className="w-full"
                                  placeholder="Customer Name"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="newData.custAddress"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Customer Address</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  className="w-full"
                                  placeholder="Customer Address"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="newData.custContactInfo"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Customer Contact Info</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  className="w-full"
                                  placeholder="Customer Contact Info"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="newData.custEmail"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Customer Email</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  className="w-full"
                                  placeholder="Customer Email"
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
                    dialogTitle="You are about to update this customer"
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
        </Dialog>
      </div>
    </div>
  )
}
