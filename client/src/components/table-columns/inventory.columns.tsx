import { ColumnDef } from '@tanstack/react-table'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { ArrowUpDownIcon, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { text } from '../ui/text'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '../ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/Form'
import { Input } from '../ui/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export type Inventories = {
  invId: string
  invAssetName: string
  invStocks: number
  invStatus: 'GOOD' | 'WARNING' | 'DEPLETED'
}

const updateFormSchema = z.object({
  invId: z.string().superRefine((val, ctx) => {
    if (val.split(' ')[0] !== 'invId') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an inventory id.`,
      })
    }
    if (!z.string().uuid().safeParse(val.split(' ')[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      })
    }
  }),
  newData: z.object({
    invAssetName: z.string().optional(),
    invStocks: z.number().optional(),
    invStatus: z.enum(['GOOD', 'WARNING', 'DEPLETED']).optional(),
  }),
})

export const inventoryColumns: ColumnDef<Inventories>[] = [
  {
    accessorKey: 'invAssetName',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Asset Name
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'invStocks',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Asset Stocks
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'invStatus',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={text({ variant: 'body', className: 'p-0' })}
        >
          Asset Status
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const form = useForm<z.infer<typeof updateFormSchema>>({
        defaultValues: {
          invId: row.original.invId,
          newData: {
            invAssetName: row.original.invAssetName,
            invStocks: row.original.invStocks,
            invStatus: row.original.invStatus,
          },
        },
        resolver: zodResolver(updateFormSchema),
      })

      const queryClient = useQueryClient()

      const updateInventory = useMutation({
        mutationKey: ['updateInventory'],
        mutationFn: (payload: z.infer<typeof updateFormSchema>) => {
          return fetch('http://localhost:3000/inventory', {
            method: 'PUT',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify(payload),
            credentials: 'include',
          })
            .then((response) => response.json())
            .then((data) => {
              return data
            })
        },
        onSuccess: async () => {
          await queryClient.refetchQueries({ queryKey: ['Inventories'] })
        },
      })

      const handleSubmit = (values: z.infer<typeof updateFormSchema>) => {
        console.log('test')
        updateInventory.mutate(values)
      }

      return (
        <div className="flex justify-between ">
          <div className="flex gap-4 items-center">
            <div
              className={cn([
                'w-10 h-10 rounded-full',
                row.original.invStatus === 'WARNING' && 'bg-yellow-500',
                row.original.invStatus === 'GOOD' && 'bg-emerald-500',
                row.original.invStatus === 'DEPLETED' && 'bg-red-500 ',
              ])}
            ></div>
            <div>{row.original.invStatus}</div>
          </div>
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>View Inventory Details</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DialogTrigger asChild>
                    <DropdownMenuItem className="flex justify-between">
                      Update Inventory
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>

              <DialogContent>
                <DialogHeader>Update Inventory</DialogHeader>
                <div>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                      <div className="flex flex-col gap-4">
                        <FormField
                          control={form.control}
                          name="invId"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Asset ID</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  disabled
                                  className="w-full"
                                  placeholder="Asset ID"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="newData.invAssetName"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Asset Name</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  className="w-full"
                                  placeholder="Asset Name"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="newData.invStocks"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Asset Stocks</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  className="w-full"
                                  placeholder="Asset Stocks"
                                  {...field}
                                  onChange={(event) =>
                                    field.onChange(+event.target.value)
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="newData.invStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Asset Status</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="GOOD">GOOD</SelectItem>
                                    <SelectItem value="WARNING">
                                      WARNING
                                    </SelectItem>
                                    <SelectItem value="DEPLETED">
                                      DEPLETED
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-between">
                          <DialogClose asChild>
                            <Button type="submit">Update</Button>
                          </DialogClose>
                          <div className="flex gap-2">
                            <Button
                              variant={'secondary'}
                              onClick={() => form.reset()}
                            >
                              Clear
                            </Button>
                            <DialogClose asChild>
                              <Button variant={'outline'}>Cancel</Button>
                            </DialogClose>
                          </div>
                        </div>
                      </div>
                    </form>
                  </Form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )
    },
  },
]
