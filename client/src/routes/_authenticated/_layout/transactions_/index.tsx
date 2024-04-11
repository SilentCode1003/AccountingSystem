import DataTable from '@/components/DataTable'
import {
  Customer,
  transactionColumns,
  Vendor,
  type Transactions,
} from '@/components/table-columns/transactions.columns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ToWords } from 'to-words'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { SelectGroup, SelectValue } from '@radix-ui/react-select'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import DatePicker from '@/components/ui/DatePicker'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Employees } from '@/components/table-columns/employees.columns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTransactionSchema } from '@/validators/transactions.validator'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'

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
  component: TransactionsComponent,
})

function TransactionsComponent() {
  const transactions = useQuery({
    queryKey: ['Transactions'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/transactions`,
        {
          credentials: 'include',
        },
      )

      const transactionData = (await response.json()) as Promise<{
        transactions: Array<Transactions>
      }>

      return transactionData
    },
  })

  const queryClient = useQueryClient()
  const createTransaction = useMutation({
    mutationKey: ['createTransaction'],
    mutationFn: async (payload: z.infer<typeof createTransactionSchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/transactions`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      )
      const data = (await response.json()) as {
        transaction: Transactions
      }
      return data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ['Transactions'],
        (old: { transactions: Array<Transactions> }) => {
          return { transactions: [...old.transactions, data.transaction] }
        },
      )
      form.reset()
    },
  })

  const transactionPartners = useQuery({
    queryKey: ['TransactionPartners'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/transactionPartners`,
        {
          credentials: 'include',
        },
      )
      const data = response.json() as Promise<{
        employees: Array<Employees>
        customers: Array<Customer>
        vendors: Array<Vendor>
      }>
      return data
    },
  })

  const [person, setPerson] = useState<string>('')
  const [amount, setAmount] = useState<number>(0.0)
  const [date, setDate] = useState<Date>()

  const form = useForm<z.infer<typeof createTransactionSchema>>({
    defaultValues: {
      tranAmount: 0,
      tranDescription: '',
      tranPartner: '',
      tranAccType: 'EXPENSE',
    },
    resolver: zodResolver(createTransactionSchema),
  })

  const handleSubmit = (values: z.infer<typeof createTransactionSchema>) => {
    createTransaction.mutate(values)
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
        <Card className="flex-1">
          <CardHeader>Create Transaction</CardHeader>
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
                            <Select
                              defaultValue={field.value}
                              onValueChange={(value) => {
                                setPerson(value)
                                field.onChange(value)
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Pick One" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Employees</SelectLabel>
                                  {transactionPartners.data.employees.map(
                                    (emp) => (
                                      <SelectItem
                                        key={emp.empId}
                                        value={emp.empId}
                                      >
                                        {emp.empName} | Employee
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectGroup>
                                <SelectSeparator />
                                <SelectGroup>
                                  <SelectLabel>Customers</SelectLabel>
                                  {transactionPartners.data.customers.map(
                                    (cust) => (
                                      <SelectItem
                                        key={cust.custId}
                                        value={cust.custId}
                                      >
                                        {cust.custName} | Customers
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectGroup>
                                <SelectSeparator />
                                <SelectGroup>
                                  <SelectLabel>Vendors</SelectLabel>
                                  {transactionPartners.data.vendors.map(
                                    (vd) => (
                                      <SelectItem key={vd.vdId} value={vd.vdId}>
                                        {vd.vdName} | Vendor
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="tranAccType"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="flex items-center justify-between">
                          <FormLabel>Account Type</FormLabel>
                        </div>
                        <FormControl>
                          {transactionPartners.isSuccess && (
                            <Select
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Account type" />
                              </SelectTrigger>
                              <SelectContent className="flex-1">
                                <SelectItem value="EXPENSE">EXPENSE</SelectItem>
                                <SelectItem value="REVENUE">REVENUE</SelectItem>
                                <SelectItem value="RECEIVABLE">
                                  RECEIVABLE
                                </SelectItem>
                                <SelectItem value="PAYABLE">PAYABLE</SelectItem>
                              </SelectContent>
                            </Select>
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
              <Button
                className="flex-1"
                onClick={form.handleSubmit(handleSubmit)}
              >
                Submit
              </Button>
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
      </div>
    </div>
  )
}

export default TransactionsComponent
