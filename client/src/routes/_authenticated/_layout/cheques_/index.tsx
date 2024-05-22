import { ComboBox } from '@/components/Combobox'
import DataTable from '@/components/DataTable'
import { CreateByFileUpload } from '@/components/FileDropZone'
import { LoadingTable } from '@/components/LoadingComponents'
import { PromptModal } from '@/components/PromptModal'
import {
  chequeColumns,
  type Cheques,
} from '@/components/table-columns/cheques.columns'
import {
  AlertDialog,
  AlertDialogCancel,
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
import { useCreateCheque, useCreateChequeByFile } from '@/hooks/mutations'
import { useAccountTypes, useCheques, useModesOfPayment } from '@/hooks/queries'
import { chequesOptions } from '@/hooks/queries/options'
import { createChequeSchema } from '@/validators/cheques.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { ReceiptIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const Route = createFileRoute('/_authenticated/_layout/cheques/')({
  loader: async ({ context }) => {
    const cheques = await context.queryClient.ensureQueryData(chequesOptions())
    return { cheques }
  },
  component: Cheques,
  pendingComponent: LoadingComponent,
})

function LoadingComponent() {
  return (
    <div className="p-4 w-full flex flex-col gap-8 items-center min-h-[85vh]">
      <LoadingTable />
    </div>
  )
}

const CrudComponents = () => {
  const [open, setOpen] = useState<boolean>(false)
  const accountTypes = useAccountTypes()
  const modesOfPayment = useModesOfPayment()
  const createCheque = useCreateCheque({ setOpen })
  const [file, setFile] = useState<File>()
  const [uploadOpen, setUploadOpen] = useState(false)
  const createChequeByFile = useCreateChequeByFile({ setOpen: setUploadOpen })
  const form = useForm<z.infer<typeof createChequeSchema>>({
    defaultValues: {
      chqAmount: 0,
      chqPayeeName: '',
      chqStatus: 'PENDING',
      chqNumber: '',
      chqMopId: '',
    },
    resolver: zodResolver(createChequeSchema),
  })

  const handleSubmit = (values: z.infer<typeof createChequeSchema>) => {
    const fd = new FormData()

    Object.keys(values).forEach((key) => {
      fd.append(key, values[key as keyof typeof values] as any)
    })
    createCheque.mutate(fd)
  }

  return (
    <div className="flex flex-col gap-4">
      <Text variant={'heading2bold'}>Cheques</Text>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <Button className="flex gap-2" onClick={() => setOpen(true)}>
          Add Cheque <ReceiptIcon />
        </Button>
        <AlertDialogContent className="scale-75 sm:scale-100">
          <AlertDialogHeader>
            <div className="flex justify-between">
              <Text variant={'heading3bold'}>Create Cheque</Text>
              <CreateByFileUpload
                open={uploadOpen}
                setOpen={setUploadOpen}
                setFile={setFile}
                file={file}
                fileName="chqFile"
                label="Upload an xlsx file to create cheques!"
                mutate={createChequeByFile.mutate}
              />
            </div>
          </AlertDialogHeader>
          <Form {...form}>
            <form>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="chqPayeeName"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Payee Name</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Payee Name"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="chqNumber"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Cheque Number</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Cheque Number"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="chqAmount"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Cheque Amount</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          className="w-full"
                          type="number"
                          placeholder="Amount"
                          step="0.01"
                          {...field}
                          value={Number.isNaN(field.value) ? '' : field.value}
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
                  name="chqMopId"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Mode of Payment</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        {modesOfPayment.isSuccess && (
                          <ComboBox
                            data={modesOfPayment.data.modesOfPayment.map(
                              (mop) => ({
                                value: mop.mopId,
                                label: mop.mopName,
                              }),
                            )}
                            emptyLabel="Nothing Selected"
                            value={field.value}
                            setValue={field.onChange}
                          />
                        )}
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="chqFile"
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
                  control={form.control}
                  name="chqStatus"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Status</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="APPROVED">
                              <Badge className="bg-green-500 hover:bg-gray-500">
                                APPROVED
                              </Badge>
                            </SelectItem>
                            <SelectItem value="PENDING">
                              <Badge className="bg-yellow-500 hover:bg-gray-500">
                                PENDING
                              </Badge>
                            </SelectItem>
                            <SelectItem value="REJECTED">
                              <Badge className="bg-red-500 hover:bg-gray-500">
                                REJECTED
                              </Badge>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="chqAccTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Account Type</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        {accountTypes.isSuccess && (
                          <ComboBox
                            data={accountTypes.data.accountTypes.map((t) => ({
                              label: t.accTypeName,
                              value: t.accTypeId,
                            }))}
                            emptyLabel="Nothing Found"
                            value={field.value}
                            setValue={field.onChange}
                          />
                        )}
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="chqIssueDate"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Issue Date</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          setDate={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
          <div className="flex justify-between">
            <PromptModal
              dialogMessage="Continue?"
              prompType="ADD"
              dialogTitle="You are about to create a new cheque"
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

function Cheques() {
  const cheques = useCheques()

  return (
    <div className="p-4 min-h-[85vh] flex flex-col items-center">
      {cheques.isSuccess && (
        <DataTable
          CrudComponents={CrudComponents}
          className="w-full md:w-[70vw]"
          columns={chequeColumns}
          data={cheques.data.cheques}
          showVisibility
          filter={[
            {
              filterColumn: 'chqIssueDate',
              filterPlaceHolder: 'Filter Issue Date',
              date: true,
            },
            {
              filterColumn: 'chqAmount',
              filterPlaceHolder: 'Filter Amount',
            },
            {
              filterColumn: 'chqPayeeName',
              filterPlaceHolder: 'Filter by payee name',
            },
            {
              filterColumn: 'chqStatus',
              filterPlaceHolder: 'Filter by status',
              filterValues: ['PENDING', 'APPROVED', 'REJECTED'],
            },
          ]}
        />
      )}
    </div>
  )
}

export default Cheques
