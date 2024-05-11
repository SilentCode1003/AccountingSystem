import { useUpdateInventory } from '@/hooks/mutations'
import { cn } from '@/lib/utils'
import { updateFormSchema } from '@/validators/inventory.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { CellContext } from '@tanstack/react-table'
import { MoreHorizontalIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Inventories } from '../table-columns/inventory.columns'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
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
import { PromptModal } from '../PromptModal'
import { useState } from 'react'
import { Badge } from '../ui/badge'

export const InventoryPricePerUnitColumn = ({
  row,
}: CellContext<Inventories, unknown>) => {
  const amount = parseFloat(row.getValue('invPricePerUnit'))
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount)
  return formatted
}

export const StatusColumn = ({ row }: CellContext<Inventories, unknown>) => {
  const [open, setOpen] = useState<boolean>(false)
  const form = useForm<z.infer<typeof updateFormSchema>>({
    defaultValues: {
      invId: row.original.invId,
      newData: {
        invAssetName: row.original.invAssetName,
        invPricePerUnit: Number.parseFloat(
          String(row.original.invPricePerUnit),
        ),
        invStocks: row.original.invStocks,
        invStatus: row.original.invStatus,
      },
    },
    resolver: zodResolver(updateFormSchema),
  })

  const updateInventory = useUpdateInventory({ setOpen })
  const handleSubmit = (values: z.infer<typeof updateFormSchema>) => {
    updateInventory.mutate(values)
  }

  return (
    <div className="flex justify-between items-center ">
      <div>
        <Badge
          className={cn(
            [
              row.original.invStatus === 'WARNING' && 'bg-yellow-500',
              row.original.invStatus === 'GOOD' && 'bg-emerald-500',
              row.original.invStatus === 'DEPLETED' && 'bg-red-500 ',
            ],
            'hover:bg-gray-500',
          )}
        >
          {row.original.invStatus}
        </Badge>
      </div>
      <div>
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

          <DialogContent className="scale-75 md:scale-100">
            <DialogHeader>Update Inventory</DialogHeader>
            <div className="space-y-4">
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
                      name="newData.invPricePerUnit"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input
                              className="w-full"
                              type="number"
                              placeholder="Total Deduction"
                              step="0.01"
                              {...field}
                              value={
                                Number.isNaN(field.value) ? '' : field.value
                              }
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value))
                              }}
                            />
                          </FormControl>
                          <FormMessage />
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
                                <SelectItem value="GOOD">
                                  <Badge className="hover:bg-gray-500 bg-emerald-500">
                                    GOOD
                                  </Badge>
                                </SelectItem>
                                <SelectItem value="WARNING">
                                  <Badge className="hover:bg-gray-500 bg-yellow-500">
                                    WARNING
                                  </Badge>
                                </SelectItem>
                                <SelectItem value="DEPLETED">
                                  <Badge className="hover:bg-gray-500 bg-red-500">
                                    DEPLETED
                                  </Badge>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
              <div className="flex justify-between">
                <PromptModal
                  dialogMessage="Continue?"
                  prompType="UPDATE"
                  dialogTitle="You are about to update this inventory"
                  triggerText="Update"
                  callback={form.handleSubmit(handleSubmit)}
                />
                <div className="flex gap-2">
                  <Button variant={'secondary'} onClick={() => form.reset()}>
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
      </div>
    </div>
  )
}
