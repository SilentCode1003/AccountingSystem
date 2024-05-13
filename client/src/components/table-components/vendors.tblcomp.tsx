import { useUpdateVendor } from '@/hooks/mutations'
import { updateVendorSchema } from '@/validators/vendors.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { CellContext } from '@tanstack/table-core'
import { MoreHorizontalIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { PromptModal } from '../PromptModal'
import { Vendors } from '../table-columns/vendors.columns'
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

export const VendorEmailColumn = ({ row }: CellContext<Vendors, unknown>) => {
  const [open, setOpen] = useState<boolean>(false)
  const form = useForm({
    defaultValues: {
      vdId: row.original.vdId,
      newData: {
        vdName: row.original.vdName,
        vdAddress: row.original.vdAddress,
        vdContactInfo: row.original.vdContactInfo,
        vdEmail: row.original.vdEmail,
      },
    },
    resolver: zodResolver(updateVendorSchema),
  })

  const updateVendor = useUpdateVendor({ setOpen, cell: { row } })

  const handleSubmit = (values: z.infer<typeof updateVendorSchema>) => {
    updateVendor.mutate(values)
  }

  return (
    <div className="flex justify-between items-center">
      <div>{row.original.vdEmail}</div>
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
                    navigator.clipboard.writeText(row.original.vdId)
                  }
                >
                  Copy Vendor ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DialogTrigger asChild>
                  <DropdownMenuItem>Update Vendor</DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="scale-75 md:scale-100">
              <DialogHeader>
                <DialogTitle>
                  <Text variant="heading3bold">Update Vendor</Text>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-4 overflow-y-auto max-h-96">
                        <FormField
                          control={form.control}
                          name="vdId"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Vendor ID</FormLabel>
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
                          name="newData.vdName"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Vendor Name</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  className="w-full"
                                  placeholder="Vendor Name"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="newData.vdAddress"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Vendor Address</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  className="w-full"
                                  placeholder="Vendor Address"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="newData.vdContactInfo"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Vendor Contact Info</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  className="w-full"
                                  placeholder="Vendor Contact Info"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="newData.vdEmail"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Vendor Email</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  className="w-full"
                                  placeholder="Vendor Email"
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
                    dialogTitle="You are about to update this vendor"
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
