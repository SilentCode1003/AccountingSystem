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
import { Label } from '@/components/ui/label'
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
import { useQuery } from '@tanstack/react-query'
import { Employees } from '@/components/table-columns/employees.columns'

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
      const response = await fetch('http://localhost:3000/transactions', {
        credentials: 'include',
      })

      const transactionData = (await response.json()) as Promise<{
        transactions: Array<Transactions>
      }>

      return transactionData
    },
  })

  const transactionPartners = useQuery({
    queryKey: ['TransactionPartners'],
    queryFn: async () => {
      const response = await fetch(
        'http://localhost:3000/transactionPartners',
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

  return (
    <div className="p-4  flex flex-col gap-8 items-center min-h-[85vh]">
      {transactions.isSuccess && (
        <DataTable
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
            <div className="flex gap-4">
              <div className="flex-1">
                <Label>Amount</Label>
                <Input
                  className="w-full"
                  type="number"
                  placeholder="Amount"
                  step="0.01"
                  value={String(!Number.isNaN(amount) ? amount : 0)}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                />
              </div>
              <div className="flex-1 flex flex-col">
                <Label>Transaction Date</Label>
                <DatePicker date={date} setDate={setDate} />
              </div>
            </div>
            <div className="flex flex-col">
              <Label>Person Transacting with</Label>
              {transactionPartners.isSuccess && (
                <Select value={person} onValueChange={setPerson}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pick One" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Employees</SelectLabel>
                      {transactionPartners.data.employees.map((emp) => (
                        <SelectItem key={emp.empId} value={emp.empId}>
                          {emp.empName} | Employee
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Customers</SelectLabel>
                      {transactionPartners.data.customers.map((cust) => (
                        <SelectItem key={cust.custId} value={cust.custId}>
                          {cust.custName} | Customers
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Vendors</SelectLabel>
                      {transactionPartners.data.vendors.map((vd) => (
                        <SelectItem key={vd.vdId} value={vd.vdId}>
                          {vd.vdName} | Vendor
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="flex flex-col">
              <Label>Transaction Description</Label>
              <Textarea placeholder="Transaction Description" />
            </div>
            <div className="flex w-full gap-4">
              <Button className="flex-1">Submit</Button>
              <Button className="flex-1" variant={'outline'}>
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
