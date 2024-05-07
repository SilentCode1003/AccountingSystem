import { ComboBox } from '@/components/Combobox'
import DataTable from '@/components/DataTable'
import { PromptModal } from '@/components/PromptModal'
import { inventoryEntriesColumns } from '@/components/table-columns/inventoryEntries.columns'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import DatePicker from '@/components/ui/DatePicker'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Text } from '@/components/ui/text'
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
import { createFileRoute } from '@tanstack/react-router'
import { PackagePlusIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const Route = createFileRoute(
  '/_authenticated/_layout/inventoryEntries/',
)({
  component: InventoryEntriesComponent,
})

function CrudComponents() {
  const [open, setOpen] = useState<boolean>(false)
  const createInventoryEntry = useCreateInventoryEntry({ setOpen })
  const form = useForm<z.infer<typeof createInventoryEntrySchema>>({
    defaultValues: {
      invEntryQuantity: 0,
      invEntryType: 'INCOMING',
      invEntryPartner: '',
    },
    resolver: zodResolver(createInventoryEntrySchema),
  })
  const transactionPartners = useTransactionPartners()
  const inventories = useInventories()

  const handleSubmit = (values: z.infer<typeof createInventoryEntrySchema>) => {
    const fd = new FormData()
    Object.keys(values).forEach((key) => {
      fd.append(key, values[key as keyof typeof values] as any)
    })
    createInventoryEntry.mutate(fd)
  }

  return (
    <div className="flex flex-col gap-4">
      <Text variant={'heading1bold'}>Inventory Entries</Text>
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
              </div>
            </form>
          </Form>
          <div className="flex justify-between">
            <PromptModal
              dialogMessage="Continue?"
              prompType="ADD"
              dialogTitle="You are about to create a new inventory"
              triggerText="Create"
              callback={form.handleSubmit(handleSubmit)}
            />
            <div className="flex gap-2 ">
              <Button variant={'secondary'} onClick={() => form.clearErrors()}>
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
