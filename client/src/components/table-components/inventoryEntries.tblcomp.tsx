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
import {
  MoreHorizontalIcon,
  PackagePlusIcon,
  UndoIcon,
  XIcon,
} from 'lucide-react'
import { Control, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { ComboBox } from '../Combobox'
import ExpandedTable from '../ExpandedTable'
import { PromptModal } from '../PromptModal'
import { InventoryEntries } from '../table-columns/inventoryEntries.columns'
import { inventoryEntryProductsColumns } from '../table-columns/inventoryEntryProducts.columns'
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
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import { Inventories } from '../table-columns/inventory.columns'
import { useState } from 'react'

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
          <DialogContent className="rounded-md max-w-fit sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Account Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 sm:space-y-2">
              <div className="flex flex-col sm:flex-row">
                <Text className="w-full sm:w-[33%]" variant={'body'}>
                  Account Name
                </Text>
                <Badge variant={'outline'} className="w-fit">
                  {row.original.transaction.account.accName}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row">
                <Text className="w-full sm:w-[33%]" variant={'body'}>
                  Account Type
                </Text>
                <Badge variant={'secondary'} className="w-fit">
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

// export const InventoryEntryInventoryColumn = ({
//   row,
// }: CellContext<InventoryEntries, unknown>) => {
//   return (
//     <div className="flex justify-between items-center">
//       <Badge variant={'outline'} className="text-center max-w-max">
//         {row.original.inventory.invAssetName}
//       </Badge>
//       <div>
//         <Dialog>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontalIcon className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//               <DropdownMenuItem
//                 className="hover:cursor-pointer"
//                 onClick={() =>
//                   navigator.clipboard.writeText(row.original.inventory.invId)
//                 }
//               >
//                 Copy Inventory ID
//               </DropdownMenuItem>
//               <DialogTrigger asChild>
//                 <DropdownMenuItem className="hover:cursor-pointer">
//                   View Inventory Details
//                 </DropdownMenuItem>
//               </DialogTrigger>
//             </DropdownMenuContent>
//           </DropdownMenu>
//           <DialogContent className="rounded-md w-fit sm:max-w-[500px]">
//             <DialogHeader>
//               <DialogTitle>Inventory Details</DialogTitle>
//             </DialogHeader>

//             <div className="space-y-4 sm:space-y-0">
//               <div className="flex flex-col sm:flex-row sm:gap-32">
//                 <Text className="w-full " variant={'body'}>
//                   Name
//                 </Text>
//                 <Text variant={'label'} className="flex-1 whitespace-nowrap">
//                   {row.original.inventory.invAssetName}
//                 </Text>
//               </div>
//               <div className="flex flex-col sm:flex-row sm:gap-8">
//                 <Text className="w-full " variant={'body'}>
//                   Price Per Unit
//                 </Text>
//                 <Text variant={'label'} className="flex-1 whitespace-nowrap">
//                   {new Intl.NumberFormat('en-US', {
//                     style: 'currency',
//                     currency: 'PHP',
//                   }).format(row.original.inventory.invPricePerUnit)}
//                 </Text>
//               </div>
//               <div className="flex flex-col sm:flex-row sm:gap-8">
//                 <Text className="w-full " variant={'body'}>
//                   Stocks
//                 </Text>
//                 <Text variant={'label'} className="flex-1 whitespace-nowrap">
//                   {row.original.inventory.invStocks}
//                 </Text>
//               </div>
//               <div className="flex flex-col sm:flex-row sm:gap-8">
//                 <Text className="w-full " variant={'body'}>
//                   Status
//                 </Text>
//                 <Badge variant={'secondary'}>
//                   {row.original.inventory.invStatus}
//                 </Badge>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   )
// }

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

function InvTotalPrice({
  control,
  index,
  inventory,
}: {
  control: Control<z.infer<typeof updateInventoryEntrySchema>>
  index: number
  inventory: Inventories
}) {
  const values = useWatch({
    name: 'iepProducts',
    control,
  })
  const totalPrice = inventory
    ? values[index].iepQuantity!! * inventory.invPricePerUnit
    : 0

  return (
    <Input
      type="number"
      className="w-32"
      disabled
      min={0.01}
      step="0.01"
      value={Number.isNaN(totalPrice) ? 0 : Number(totalPrice.toFixed(2))}
    />
  )
}

function GrandTotal({
  control,
  inventories,
}: {
  control: Control<z.infer<typeof updateInventoryEntrySchema>>
  inventories: Array<Inventories>
}) {
  const values = useWatch({
    name: 'iepProducts',
    control,
  })

  const grandTotal = inventories
    ? values.reduce(
        (acc, curr) =>
          acc +
          (curr.iepInvId
            ? curr.iepQuantity!! *
              inventories.find((i) => i.invId === curr.iepInvId)!
                .invPricePerUnit
            : 0),
        0,
      )
    : 0

  return (
    <div className="flex justify-start gap-4 items-center">
      <Text variant={'bodybold'}>Grand Total:</Text>
      <Text variant={'bodybold'}>
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'PHP',
        }).format(Number.isNaN(grandTotal) ? 0 : Number(grandTotal.toFixed(2)))}
      </Text>
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
      iepProducts: props.row.original.inventoryEntryProducts.map((p) => ({
        iepInvId: p.inventory.invId,
        iepQuantity: Number(p.iepQuantity),
      })),
    },
    resolver: zodResolver(updateInventoryEntrySchema),
  })

  const { fields, append, remove } = useFieldArray({
    name: 'iepProducts',
    control: form.control,
  })
  const [selected, setSelected] = useState<
    Array<{
      index: number
      iepInvId: string
    }>
  >(
    props.row.original.inventoryEntryProducts.map((p, i) => ({
      index: i,
      iepInvId: p.inventory.invId,
    })),
  )

  const transactionPartners = useTransactionPartners()

  const updateInventoryEntry = useUpdateInventoryEntry({
    setIsOpen: setOpen,
    cell: { row: props.row },
  })

  const handleSubmit = (values: z.infer<typeof updateInventoryEntrySchema>) => {
    const fd = new FormData()
    Object.keys(values).forEach((key) => {
      if (key === 'iepProducts') {
        values['iepProducts'].map((i) =>
          fd.append(`iepProducts`, `${i.iepInvId}?${i.iepQuantity}`),
        )
      } else fd.append(key, values[key as keyof typeof values] as any)
    })
    updateInventoryEntry.mutate(fd)

    form.clearErrors()
  }
  return (
    <Dialog {...props}>
      <DialogContent className="scale-75 md:scale-100">
        <Dialog>
          <DialogHeader>Update Transaction</DialogHeader>

          <div className="space-y-4">
            <Form {...form}>
              <form className="flex flex-col gap-4">
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
                                : transactionPartners.data.customers.map(
                                    (c) => ({
                                      label: `${c.custName} | Customer`,
                                      value: c.custId,
                                    }),
                                  )
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
                <DialogTrigger asChild>
                  <Button
                    variant={'outline'}
                    className="w-ful flex justify-start gap-4 items-center"
                  >
                    <PackagePlusIcon />
                    Products
                  </Button>
                </DialogTrigger>
                {form.formState.errors.iepProducts &&
                  form.formState.errors.iepProducts.root && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.iepProducts.root.message}
                    </p>
                  )}
                <DialogContent className="scale-75 md:scale-100">
                  <Text variant={'heading3bold'}>Add Products</Text>
                  <ScrollArea>
                    {fields.map((field, index) => {
                      return (
                        <div
                          key={field.id}
                          className=" w-full flex gap-4 items-start"
                        >
                          {inventories.isSuccess && (
                            <div className="flex-1">
                              <ComboBox
                                selected={selected.map((s) => s.iepInvId)}
                                data={inventories.data.inventories.map((t) => ({
                                  label: t.invAssetName,
                                  value: t.invId,
                                }))}
                                emptyLabel="Nothing Found"
                                value={
                                  form.watch('iepProducts')[index]
                                    ?.iepInvId as string
                                }
                                setValue={(v: string) => {
                                  if (selected.some((s) => s.index === index)) {
                                    setSelected(
                                      selected.map((s) => {
                                        if (s.index === index)
                                          return { index, iepInvId: v }
                                        return s
                                      }),
                                    )
                                  } else {
                                    setSelected((prev) => [
                                      ...prev,
                                      { index, iepInvId: v },
                                    ])
                                  }

                                  form.setValue(
                                    `iepProducts.${index}.iepInvId`,
                                    v,
                                  )
                                }}
                              />
                              {form.formState.errors.iepProducts &&
                                Array.isArray(
                                  form.formState.errors.iepProducts,
                                ) &&
                                form.formState.errors.iepProducts[index] &&
                                form.formState.errors.iepProducts[index]
                                  .iepInvId && (
                                  <p className="text-sm font-medium text-destructive">
                                    {
                                      form.formState.errors.iepProducts[index]
                                        .iepInvId.message
                                    }
                                  </p>
                                )}
                            </div>
                          )}
                          <div>
                            <Input
                              type="number"
                              className="w-24"
                              placeholder="Qty"
                              {...form.register(
                                `iepProducts.${index}.iepQuantity`,
                                { valueAsNumber: true, required: true },
                              )}
                            />
                            {form.formState.errors.iepProducts &&
                              Array.isArray(
                                form.formState.errors.iepProducts,
                              ) &&
                              form.formState.errors.iepProducts[index] &&
                              form.formState.errors.iepProducts[index]
                                .iepQuantity && (
                                <p className="text-sm font-medium text-destructive max-w-24 text-wrap">
                                  {
                                    form.formState.errors.iepProducts[index]
                                      .iepQuantity.message
                                  }
                                </p>
                              )}
                          </div>

                          <InvTotalPrice
                            control={form.control}
                            index={index}
                            inventory={
                              inventories.data?.inventories.find(
                                (t) =>
                                  t.invId ===
                                  form.watch('iepProducts')[index]?.iepInvId,
                              ) as Inventories
                            }
                          />

                          <Button
                            variant={'destructive'}
                            className="p-2 h-fit mr-4"
                            onClick={() => {
                              remove(index)
                              setSelected((prev) =>
                                prev.filter((s) => s.index !== index),
                              )
                            }}
                          >
                            <XIcon size={16} />
                          </Button>
                        </div>
                      )
                    })}
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>

                  {inventories.isSuccess && (
                    <GrandTotal
                      control={form.control}
                      inventories={inventories.data.inventories}
                    />
                  )}

                  <div className="flex justify-between">
                    <Button
                      onClick={() => {
                        if (
                          inventories.data?.inventories.length ===
                          form.getValues('iepProducts').length
                        )
                          return

                        append({ iepInvId: '', iepQuantity: 0 })
                      }}
                      className="flex gap-2"
                    >
                      Add
                      <PackagePlusIcon />
                    </Button>
                    <DialogClose asChild>
                      <Button variant={'secondary'} className="flex gap-2">
                        Back <UndoIcon />
                      </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
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
                <Button onClick={() => setOpen(false)} variant={'outline'}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      </DialogContent>
    </Dialog>
  )
}

export const InventoryEntriesSubComponent = ({
  row,
}: {
  row: Row<InventoryEntries>
}) => {
  return (
    <ExpandedTable
      columns={inventoryEntryProductsColumns}
      data={row.original.inventoryEntryProducts}
    />
  )
}
