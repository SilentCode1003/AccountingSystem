import { ComboBox } from '@/components/Combobox'
import DataTable from '@/components/DataTable'
import { PromptModal } from '@/components/PromptModal'
import { Inventories } from '@/components/table-columns/inventory.columns'
import { inventoryEntriesColumns } from '@/components/table-columns/inventoryEntries.columns'
import { InventoryEntriesSubComponent } from '@/components/table-components/inventoryEntries.tblcomp'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import DatePicker from '@/components/ui/DatePicker'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Text } from '@/components/ui/text'
import { toast } from '@/components/ui/use-toast'
import { useCreateInventoryEntry } from '@/hooks/mutations'
import {
  useInventories,
  useInventoryEntries,
  useTransactionPartners,
} from '@/hooks/queries'
import { createInventoryEntrySchema } from '@/validators/inventoryEntries.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertDialogCancel,
  AlertDialogTrigger,
} from '@radix-ui/react-alert-dialog'
import { Scrollbar } from '@radix-ui/react-scroll-area'
import { createFileRoute } from '@tanstack/react-router'
import { PackagePlusIcon, UndoIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { Control, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'

export const Route = createFileRoute(
  '/_authenticated/_layout/inventoryEntries/',
)({
  component: InventoryEntriesComponent,
})

function InvTotalPrice({
  control,
  index,
  inventory,
}: {
  control: Control<z.infer<typeof createInventoryEntrySchema>>
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
  control: Control<z.infer<typeof createInventoryEntrySchema>>
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

function CrudComponents() {
  const [open, setOpen] = useState<boolean>(false)
  const createInventoryEntry = useCreateInventoryEntry({ setOpen })
  const form = useForm<z.infer<typeof createInventoryEntrySchema>>({
    defaultValues: {
      invEntryType: 'INCOMING',
      invEntryPartner: '',
      iepProducts: [
        {
          iepInvId: '',
        },
      ],
    },
    resolver: zodResolver(createInventoryEntrySchema),
  })
  const { fields, append, remove } = useFieldArray({
    name: 'iepProducts',
    control: form.control,
  })
  const transactionPartners = useTransactionPartners()
  const inventories = useInventories()
  const [selected, setSelected] = useState<
    Array<{
      index: number
      iepInvId: string
    }>
  >([])

  const handleSubmit = (values: z.infer<typeof createInventoryEntrySchema>) => {
    const fd = new FormData()
    Object.keys(values).forEach((key) => {
      if (key === 'iepProducts') {
        values['iepProducts'].map((i) =>
          fd.append(`iepProducts`, `${i.iepInvId}?${i.iepQuantity}`),
        )
      } else fd.append(key, values[key as keyof typeof values] as any)
    })
    createInventoryEntry.mutate(fd)
    form.clearErrors()
  }

  return (
    <div className="flex flex-col gap-4">
      <Text variant={'heading1bold'}>Inventory Entries</Text>
      <Dialog>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button className="flex gap-2">
              Add Inventory Entry <PackagePlusIcon />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="scale-75 md:scale-100">
            <AlertDialogHeader>Create Inventory Entry</AlertDialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="flex flex-col gap-4">
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
                                  ? transactionPartners.data.vendors.map(
                                      (c) => ({
                                        label: `${c.vdName} | Vendor`,
                                        value: c.vdId,
                                      }),
                                    )
                                  : transactionPartners.data.customers.map(
                                      (c) => ({
                                        label: `${c.custName} | Customer`,
                                        value: c.custId,
                                      }),
                                    )
                              }
                              emptyLabel="Nothing Selected"
                              value={field.value}
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
                      Add Products
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
                                  data={inventories.data.inventories.map(
                                    (t) => ({
                                      label: t.invAssetName,
                                      value: t.invId,
                                    }),
                                  )}
                                  emptyLabel="Nothing Found"
                                  value={
                                    form.watch('iepProducts')[index]
                                      ?.iepInvId as string
                                  }
                                  setValue={(v: string) => {
                                    if (
                                      selected.some((s) => s.index === index)
                                    ) {
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
                      <Scrollbar orientation="horizontal" />
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

                          append({ iepInvId: '' })
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
                </div>
              </form>
            </Form>
            <div className="flex justify-between">
              <PromptModal
                dialogMessage="Continue?"
                prompType="ADD"
                dialogTitle="You are about to create a new inventory"
                triggerText="Create"
                callback={form.handleSubmit(handleSubmit, (er) => {
                  if (er.iepProducts && Array.isArray(er.iepProducts))
                    toast({
                      variant: 'destructive',
                      title: 'Error in adding products!',
                      description: 'Please check your products!',
                    })
                })}
              />
              <div className="flex gap-2 ">
                <Button
                  variant={'secondary'}
                  onClick={() => {
                    form.reset()
                    form.clearErrors()
                  }}
                >
                  Clear
                </Button>
                <AlertDialogCancel asChild>
                  <Button variant={'outline'} className="mt-0">
                    Cancel
                  </Button>
                </AlertDialogCancel>
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </Dialog>
    </div>
  )
}

function InventoryEntriesComponent() {
  const inventoryEntries = useInventoryEntries()

  return (
    <div className="p-4 min-h-[85vh] flex flex-col items-center">
      <div className="w-full translate-y-12 md:translate-y-12 sm:w-[70vw] mb-4"></div>
      {inventoryEntries.isSuccess && (
        <DataTable
          showVisibility
          className="w-full md:w-[70vw]"
          columns={inventoryEntriesColumns}
          data={inventoryEntries.data.inventoryEntries}
          getRowCanExpand={() => true}
          renderSubComponent={InventoryEntriesSubComponent}
          CrudComponents={CrudComponents}
          filter={[
            {
              filterColumn: 'invEntryType',
              filterPlaceHolder: 'Filter by type',
              filterValues: ['INCOMING', 'OUTGOING'],
            },
            {
              filterColumn: 'invEntryTotalPrice',
              filterPlaceHolder: 'Filter by Total Price',
            },
          ]}
        />
      )}
    </div>
  )
}
