import { useDeleteRoute, useUpdateRoute } from '@/hooks/mutations'
import { updateRouteSchema } from '@/validators/routes.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { CellContext } from '@tanstack/react-table'
import { MoreHorizontalIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { PromptModal } from '../PromptModal'
import { Routes } from '../table-columns/routes.columns'
import { AlertDialog, AlertDialogTrigger } from '../ui/alert-dialog'
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

export const RoutePriceColumn = ({ row }: CellContext<Routes, unknown>) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(row.getValue('routePrice'))

  return formatted
}

export const RouteModeOfTransportColumn = ({
  row,
}: CellContext<Routes, unknown>) => {
  const [open, setOpen] = useState<boolean>(false)

  const form = useForm({
    defaultValues: {
      routeId: row.original.routeId,
      newData: {
        routeStart: row.original.routeStart,
        routeEnd: row.original.routeEnd,
        routePrice: Number.parseFloat(String(row.original.routePrice)),
        routeModeOfTransport: row.original.routeModeOfTransport,
      },
    },
    resolver: zodResolver(updateRouteSchema),
  })

  const updateRoute = useUpdateRoute({ setOpen })

  const deleteRoute = useDeleteRoute()

  const handleSubmit = (values: z.infer<typeof updateRouteSchema>) => {
    updateRoute.mutate(values)
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col gap-4">
        {row.original.routeModeOfTransport}
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
                    navigator.clipboard.writeText(row.original.routeId)
                  }
                >
                  Copy Route ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DialogTrigger asChild>
                  <DropdownMenuItem>Update Route</DropdownMenuItem>
                </DialogTrigger>

                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>Delete Route Status</DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <PromptModal
              callback={() =>
                deleteRoute.mutate({
                  routeId: row.original.routeId,
                })
              }
              nonButton
              dialogMessage="Continue?"
              prompType="DELETE"
              dialogTitle="You are about to DELETE this route! Data loss may occur and cannot be undone!"
              triggerText="DELETE ROUTE"
            />

            <DialogContent className="scale-75 md:scale-100">
              <DialogHeader>
                <DialogTitle>
                  <Text variant="heading3bold">Update Route</Text>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-4 overflow-y-auto max-h-96">
                        <FormField
                          control={form.control}
                          name="routeId"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Route ID</FormLabel>
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
                          name="newData.routeStart"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Route Start</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  className="w-full"
                                  placeholder="Route Start"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="newData.routeEnd"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Route End</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  className="w-full"
                                  placeholder="Route End"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="newData.routePrice"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Route Price</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  className="w-full"
                                  type="number"
                                  placeholder="Price"
                                  step="0.01"
                                  {...field}
                                  value={
                                    Number.isNaN(field.value)
                                      ? ''
                                      : Number.parseFloat(String(field.value))
                                  }
                                  onChange={(e) =>
                                    field.onChange(parseFloat(e.target.value))
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="newData.routeModeOfTransport"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Mode of Transport</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  className="w-full"
                                  placeholder="Mode of Transport"
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
                    dialogTitle="You are about to update this route"
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
