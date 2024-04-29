import { ComboBox } from '@/components/Combobox'
import DataTable from '@/components/DataTable'
import { Dropzone } from '@/components/Dropzone'
import { LoadingTable } from '@/components/LoadingComponents'
import { PromptModal } from '@/components/PromptModal'
import { transactionColumns } from '@/components/table-columns/transactions.columns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import DatePicker from '@/components/ui/DatePicker'
import {
  DialogContent,
  DialogHeader,
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
import { Skeleton } from '@/components/ui/skeleton'
import { Text } from '@/components/ui/text'
import { Textarea } from '@/components/ui/textarea'
import {
  useCreateTransaction,
  useCreateTransactionByFile,
} from '@/hooks/mutations'
import {
  useAccountTypes,
  useTransactionPartners,
  useTransactions,
} from '@/hooks/queries'
import {
  transactionPartnersOptions,
  transactionsOptions,
} from '@/hooks/queries/options'
import { createTransactionSchema } from '@/validators/transactions.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog } from '@radix-ui/react-dialog'
import { createFileRoute } from '@tanstack/react-router'
import { FileUpIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ToWords } from 'to-words'
import { z } from 'zod'

const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: true,
    currencyOptions: {
      name: 'Pesos',
      plural: 'Pesos',
      symbol: '₱',
      fractionalUnit: {
        name: 'Centavo',
        plural: 'Centavos',
        symbol: '',
      },
    },
  },
})

export const Route = createFileRoute('/_authenticated/_layout/transactions/')({
  loader: async ({ context }) => {
    const transactions = await context.queryClient.ensureQueryData(
      transactionsOptions(),
    )

    const transactionPartners = await context.queryClient.ensureQueryData(
      transactionPartnersOptions(),
    )
    return {
      transactions,
      transactionPartners,
    }
  },
  component: TransactionsComponent,
  pendingComponent: LoadingComponent,
})

function LoadingComponent() {
  return (
    <div className="p-4 w-full flex flex-col gap-8 items-center min-h-[85vh]">
      <LoadingTable />
      <div className="flex gap-4 items-center w-full md:w-[70vw] justify-between">
        <Skeleton className="flex-1 h-80" />
        <Skeleton className="flex-1 h-80" />
      </div>
    </div>
  )
}

function TransactionsComponent() {
  const [file, setFile] = useState<File>()
  const [uploadOpen, setUploadOpen] = useState<boolean>(false)
  const transactions = useTransactions()

  const accountTypes = useAccountTypes()

  const transactionPartners = useTransactionPartners()

  const [person] = useState<string>('')
  const [amount, setAmount] = useState<number>(0.0)
  const [date, setDate] = useState<Date>()

  const form = useForm<z.infer<typeof createTransactionSchema>>({
    defaultValues: {
      tranAmount: 0,
      tranDescription: '',
      tranPartner: '',
    },
    resolver: zodResolver(createTransactionSchema),
  })
  const createTransaction = useCreateTransaction(form)

  const createTransactionByFile = useCreateTransactionByFile({
    setOpen: setUploadOpen,
  })

  const handleSubmit = (values: z.infer<typeof createTransactionSchema>) => {
    createTransaction.mutate(values)
  }

  const handleSubmitFile = () => {
    const payload = new FormData()

    payload.append('file', file as File)

    createTransactionByFile.mutate(payload)
  }

  return (
    <div className="p-4  flex flex-col gap-8 items-center min-h-[85vh]">
      {transactions.isSuccess && (
        <DataTable
          showVisibility
          pageSize={5}
          className="w-full md:w-[70vw]"
          columns={transactionColumns}
          data={transactions.data.transactions}
          filter={[
            {
              filterColumn: 'tranAmount',
              filterPlaceHolder: 'Filter by Transaction Amount',
            },
            {
              filterColumn: 'tranPartner',
              filterPlaceHolder: 'Filter by Transaction Partner',
            },
            {
              filterColumn: 'tranTransactionDate',
              filterPlaceHolder: 'Filter Transac Date',
              date: true,
            },
          ]}
        />
      )}

      <div className="flex gap-4 flex-col md:flex-row w-full md:w-[70vw]">
        <Card className="flex-1 overflow-y-auto">
          <CardHeader>Receipt Preview</CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col items-center text-center">
              <span>5L Solutions Supply & Allied Services Corp.</span>
              <span>
                B19 L12 P3B, Pacita Complex 1, San Francisco, Biñan, Laguna
              </span>
              <span>09436541916</span>
            </div>
            <div className="flex flex-col items-center">
              <b>Receipt of Payment</b>
              <div className="flex justify-evenly w-full gap-1">
                <div className="flex-1 flex flex-col h-40">
                  <div>
                    <div>
                      {date
                        ? date.toLocaleDateString()
                        : new Date().toLocaleDateString()}
                      <div>
                        {toWords.convert(!Number.isNaN(amount) ? amount : 0)}
                      </div>
                    </div>
                    <div>
                      From: <br />
                      5L Solutions Supply and Allied Services Corp.
                      <div>___________________</div>
                      <div>Signature Over Printed Name</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col h-40">
                  <div>
                    {!Number.isNaN(amount)
                      ? new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'PHP',
                        }).format(amount)
                      : 0}
                  </div>
                  <div>
                    Received by:{' '}
                    {(person.startsWith('emp') &&
                      transactionPartners.data?.employees.filter(
                        (e) => e.empId === person,
                      )[0].empName) ||
                      (person.startsWith('cust') &&
                        transactionPartners.data?.customers.filter(
                          (e) => e.custId === person,
                        )[0].custName) ||
                      (person.startsWith('vd') &&
                        transactionPartners.data?.vendors.filter(
                          (e) => e.vdId === person,
                        )[0].vdName)}
                    <div>___________________</div>
                    <div>Signature Over Printed Name</div>
                  </div>
                </div>
              </div>
              <div className="mt-10 flex justify-evenly w-full"></div>
            </div>
          </CardContent>
        </Card>
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <Card className="flex-1">
            <CardHeader className="w-full">
              <div className="flex justify-between">
                <div>Create Transaction</div>
                <DialogTrigger asChild>
                  <Button variant={'secondary'} className="px-2">
                    <FileUpIcon className="hover:cursor-pointer" />
                  </Button>
                </DialogTrigger>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Form {...form}>
                <form className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <FormField
                        name="tranAmount"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>Amount</FormLabel>
                              <FormMessage />
                            </div>
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
                                  setAmount(
                                    Number.isNaN(parseFloat(e.target.value))
                                      ? 0
                                      : (e.target.value as unknown as number),
                                  )
                                  field.onChange(parseFloat(e.target.value))
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <FormField
                        name="tranTransactionDate"
                        control={form.control}
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Transaction Date</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <DatePicker
                                  date={field.value}
                                  setDate={(value: Date) => {
                                    setDate(value)
                                    field.onChange(value)
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <FormField
                      name="tranPartner"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <div className="flex flex-col justify-between">
                            <FormLabel>Person Transacting with</FormLabel>
                          </div>
                          <FormControl>
                            {transactionPartners.isSuccess && (
                              <ComboBox
                                data={transactionPartners.data.customers
                                  .map((c) => ({
                                    label: `${c.custName} | Customer`,
                                    value: c.custId,
                                  }))
                                  .concat([
                                    {
                                      label: 'separator',
                                      value: 'separator',
                                    },
                                  ])
                                  .concat(
                                    transactionPartners.data.employees.map(
                                      (e) => ({
                                        label: `${e.empName} | Employee`,
                                        value: e.empId,
                                      }),
                                    ),
                                  )
                                  .concat([
                                    {
                                      label: 'separator',
                                      value: 'separator',
                                    },
                                  ])
                                  .concat(
                                    transactionPartners.data.vendors.map(
                                      (v) => ({
                                        label: `${v.vdName} | Vendor`,
                                        value: v.vdId,
                                      }),
                                    ),
                                  )}
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
                      name="tranAccTypeId"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <div className="flex items-center justify-between">
                            <FormLabel>Account Type</FormLabel>
                          </div>
                          <FormControl>
                            {accountTypes.isSuccess && (
                              <ComboBox
                                data={accountTypes.data.accountTypes.map(
                                  (t) => ({
                                    label: t.accTypeName,
                                    value: t.accTypeId,
                                  }),
                                )}
                                emptyLabel="Nothing Found"
                                value={field.value}
                                setValue={field.onChange}
                              />
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col">
                    <FormField
                      name="tranDescription"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Transaction Description</FormLabel>
                            <FormMessage />
                          </div>
                          <FormControl>
                            <Textarea
                              {...field}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Transaction Description"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
              <div className="flex w-full gap-4">
                <PromptModal
                  dialogMessage="Continue?"
                  prompType="ADD"
                  dialogTitle="You are about to create a new transaction"
                  triggerText="Create"
                  callback={form.handleSubmit(handleSubmit)}
                />
                <Button
                  onClick={() => {
                    form.clearErrors()
                    form.reset()
                  }}
                  className="flex-1"
                  variant={'outline'}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
          <DialogContent className="">
            <DialogHeader>
              <div className="flex gap-4">
                <Text variant="heading3bold">Upload</Text>
                <Text variant={'label'}>Upload a file to add transaction!</Text>
              </div>
            </DialogHeader>

            <Dropzone onChange={setFile} fileExtension="xlsx" />

            <Button onClick={handleSubmitFile}>Upload</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default TransactionsComponent
