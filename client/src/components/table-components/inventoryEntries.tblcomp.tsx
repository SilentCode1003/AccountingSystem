import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Text } from '@/components/ui/text'
import { useUpdateInventoryEntry } from '@/hooks/mutations'
import { useInventories, useTransactionPartners } from '@/hooks/queries'
import { updateInventoryEntrySchema } from '@/validators/inventoryEntries.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogProps } from '@radix-ui/react-dialog'
import { Row } from '@tanstack/react-table'
import { CellContext } from '@tanstack/table-core'
import { MoreHorizontalIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ComboBox } from '../Combobox'
import { PromptModal } from '../PromptModal'
import { InventoryEntries } from '../table-columns/inventoryEntries.columns'
import { Badge } from '../ui/badge'
import DatePicker from '../ui/DatePicker'
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
  MultiDialog,
  MultiDialogContainer,
  MultiDialogTrigger,
  useMultiDialog,
} from '../ui/multi-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

export const InventoryEntryDateColumn = ({
  row,
}: CellContext<InventoryEntries, unknown>) => {
  const date = new Date(row.original.invEntryDate)

  return date.toLocaleDateString()
}

export const InventoryEntryTotalPriceColumn = ({
  row,
}: CellContext<InventoryEntries, unknown>) => {
  const amount = parseFloat(String(row.original.invEntryTotalPrice))
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount)
  return formatted
}

export const InventoryEntryTypeColumn = ({
  row,
}: CellContext<InventoryEntries, unknown>) => {
  return (
    <>
      {row.original.invEntryType === 'INCOMING' ? (
        <Badge className="bg-rose-500 hover:bg-gray-500">
          {row.original.invEntryType}
        </Badge>
      ) : (
        <Badge className="bg-emerald-500 hover:bg-gray-500">
          {row.original.invEntryType}
        </Badge>
      )}
    </>
  )
}

export const InventoryEntryAccountColumn = ({
  row,
}: CellContext<InventoryEntries, unknown>) => {
  return (
    <div className="flex justify-between items-center">
      <Badge variant={'outline'} className="text-center">
        {row.original.transaction.account.accName}
      </Badge>
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
                  navigator.clipboard.writeText(
                    row.original.transaction.account.accId,
                  )
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
              <div className="flex flex-col sm:flex-row">
                <Text className="w-full sm:w-[33%]" variant={'body'}>
                  Account ID
                </Text>
                <Text variant={'label'} className="flex-1">
                  {row.original.transaction.account.accId}
                </Text>
              </div>
              <div className="flex flex-col sm:flex-row">
                <Text className="w-full sm:w-[33%]" variant={'body'}>
                  Account Type
                </Text>
                <Badge variant={'secondary'}>
                  {row.original.transaction.account.accountType.accTypeName}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row">
                <Text className="w-full sm:w-[33%]" variant={'body'}>
                  Description
                </Text>
                <Text variant={'label'} className="flex-1">
                  {row.original.transaction.account.accDescription}
                </Text>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export const InventoryEntryInventoryColumn = ({
  row,
}: CellContext<InventoryEntries, unknown>) => {
  return (
    <div className="flex justify-between items-center">
      <Badge variant={'outline'} className="text-center max-w-max">
        {row.original.inventory.invAssetName}
      </Badge>
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
                  navigator.clipboard.writeText(row.original.inventory.invId)
                }
              >
                Copy Inventory ID
              </DropdownMenuItem>
              <DialogTrigger asChild>
                <DropdownMenuItem className="hover:cursor-pointer">
                  View Inventory Details
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="rounded-md w-fit sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Inventory Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row sm:gap-32">
                <Text className="w-full " variant={'body'}>
                  Name
                </Text>
                <Text variant={'label'} className="flex-1 whitespace-nowrap">
                  {row.original.inventory.invAssetName}
                </Text>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-8">
                <Text className="w-full " variant={'body'}>
                  Price Per Unit
                </Text>
                <Text variant={'label'} className="flex-1 whitespace-nowrap">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'PHP',
                  }).format(row.original.inventory.invPricePerUnit)}
                </Text>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-8">
                <Text className="w-full " variant={'body'}>
                  Stocks
                </Text>
                <Text variant={'label'} className="flex-1 whitespace-nowrap">
                  {row.original.inventory.invStocks}
                </Text>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-8">
                <Text className="w-full " variant={'body'}>
                  Status
                </Text>
                <Badge variant={'secondary'}>
                  {row.original.inventory.invStatus}
                </Badge>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export const InventoryEntryPartnerColumn = ({
  dashboard,
  row,
}: CellContext<InventoryEntries, unknown> & { dashboard?: boolean }) => {
  let data: {
    id: string
    type?: string
    name?: string
    contactInfo?: string
    email?: string
    isActive?: string
    dateHired?: string
    address?: string
  }
  if (row.original.invEntryCustId) {
    data = {
      id: row.original.customer.custId,
      type: 'customer',
      name: row.original.customer.custName,
      contactInfo: row.original.customer.custContactInfo,
      email: row.original.customer.custEmail,
      address: row.original.customer.custAddress,
    }
  } else {
    data = {
      id: row.original.vendor.vdId,
      type: 'vendor',
      name: row.original.vendor.vdName,
      contactInfo: row.original.vendor.vdContactInfo,
      email: row.original.vendor.vdEmail,
    }
  }
  return (
    <div className="flex justify-between items-center">
      <div>{data.name}</div>
      <div>
        <MultiDialog>
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
                onClick={() => navigator.clipboard.writeText(data.id)}
              >
                Copy ID
              </DropdownMenuItem>
              <MultiDialogTrigger value="viewDetails">
                <DropdownMenuItem className="hover:cursor-pointer">
                  View Details
                </DropdownMenuItem>
              </MultiDialogTrigger>
              {!dashboard && (
                <MultiDialogTrigger value="updateTransaction">
                  <DropdownMenuItem className="hover:cursor-pointer">
                    Update Transaction
                  </DropdownMenuItem>
                </MultiDialogTrigger>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <MultiDialogContainer value="viewDetails">
            <Dialog>
              <DialogContent className="rounded-md sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {(data.type === 'employee' && 'Employee Details') ||
                      (data.type === 'customer' && 'Customer Details') ||
                      (data.type === 'vendor' && 'Vendor Details')}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row">
                    <Text className="w-full sm:w-[33%]" variant={'body'}>
                      Name
                    </Text>
                    <Text variant={'label'} className="flex-1">
                      {data.name}
                    </Text>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <Text className="w-full sm:w-[33%]" variant={'body'}>
                      Email
                    </Text>
                    <Text variant={'label'} className="flex-1">
                      {data.email}
                    </Text>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <Text className="w-full sm:w-[33%]" variant={'body'}>
                      Contact Info
                    </Text>
                    <Text variant={'label'} className="flex-1">
                      {data.contactInfo}
                    </Text>
                  </div>
                  {data.address && (
                    <div className="flex flex-col sm:flex-row">
                      <Text className="w-full sm:w-[33%]" variant={'body'}>
                        Address
                      </Text>
                      <Text variant={'label'} className="flex-1">
                        {data.address}
                      </Text>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </MultiDialogContainer>
          {!dashboard && (
            <MultiDialogContainer value="updateTransaction">
              <UpdateFormDialog row={row} />
            </MultiDialogContainer>
          )}
        </MultiDialog>
      </div>
    </div>
  )
}

function UpdateFormDialog(props: DialogProps & { row: Row<InventoryEntries> }) {
  const [, setOpen] = useMultiDialog('updateTransaction')
  const inventories = useInventories()
  const form = useForm<z.infer<typeof updateInventoryEntrySchema>>({
    defaultValues: {
      invEntryDate: new Date(props.row.original.invEntryDate),
      invEntryId: props.row.original.invEntryId,
      invEntryPartner:
        props.row.original.invEntryCustId ??
        props.row.original.invEntryVdId ??
        undefined,
      invEntryType: props.row.original.invEntryType,
      invEntryTranId: props.row.original.invEntryTranId,
      invEntryInvId: props.row.original.invEntryInvId,
      invEntryQuantity: props.row.original.invEntryQuantity,
    },
    resolver: zodResolver(updateInventoryEntrySchema),
  })
  const transactionPartners = useTransactionPartners()

  //   const updateTransaction = useUpdateTransaction({
  //     setOpenUpdate: setOpen,
  //     cell: { row: props.row },
  //   })

  const updateInventoryEntry = useUpdateInventoryEntry({
    setIsOpen: setOpen,
    cell: { row: props.row },
  })

  const handleSubmit = (values: z.infer<typeof updateInventoryEntrySchema>) => {
    const fd = new FormData()

    Object.keys(values).forEach((key) => {
      fd.append(key, values[key as keyof typeof values] as any)
    })
    updateInventoryEntry.mutate(fd)
  }
  return (
    <Dialog {...props}>
      <DialogContent className="scale-75 md:scale-100">
        <DialogHeader>Update Transaction</DialogHeader>
        <div className="space-y-4">
          <Form {...form}>
            <form className="flex flex-col gap-4">
              <FormField
                name="invEntryInvId"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Inventory</FormLabel>
                    <FormControl>
                      {inventories.isSuccess && (
                        <ComboBox
                          data={inventories.data.inventories.map((c) => ({
                            label: c.invAssetName,
                            value: c.invId,
                          }))}
                          emptyLabel="Nothing Selected"
                          value={field.value as string}
                          setValue={field.onChange}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="invEntryQuantity"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Quantity</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Quantity"
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
                name="invEntryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INCOMING">
                            <Badge className="bg-rose-500 hover:bg-gray-500">
                              INCOMING
                            </Badge>
                          </SelectItem>
                          <SelectItem value="OUTGOING">
                            <Badge className="bg-emerald-500 hover:bg-gray-500">
                              OUTGOING
                            </Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="invEntryPartner"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Person Transacting with</FormLabel>
                    <FormControl>
                      {transactionPartners.isSuccess && (
                        <ComboBox
                          data={
                            form.getValues('invEntryType') === 'INCOMING'
                              ? transactionPartners.data.vendors.map((c) => ({
                                  label: `${c.vdName} | Vendor`,
                                  value: c.vdId,
                                }))
                              : transactionPartners.data.customers.map((c) => ({
                                  label: `${c.custName} | Customer`,
                                  value: c.custId,
                                }))
                          }
                          emptyLabel="Nothing Selected"
                          value={field.value as string}
                          setValue={field.onChange}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="invEntryFile"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Supporting File</FormLabel>
                    <FormControl>
                      <Input
                        ref={field.ref}
                        onBlur={field.onBlur}
                        onChange={(e: any) => {
                          if (!e.target.files) return

                          if (!e.target.files[0]) return
                          field.onChange(e.target.files[0])
                        }}
                        type="file"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .pdf"
                        className="w-full hover:cursor-pointer"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="invEntryDate"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Transaction Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          setDate={(value: Date) => {
                            field.onChange(value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </form>
          </Form>
          <div className="flex justify-between">
            <PromptModal
              dialogMessage="Continue?"
              prompType="UPDATE"
              dialogTitle="You are about to update this transaction"
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
  )
}
