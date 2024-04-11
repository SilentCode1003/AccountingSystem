import DataTable from '@/components/DataTable'
import {
  ExpenseColumns,
  RevenueColumns,
} from '@/components/table-columns/incomeStatement.columns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { text, Text } from '@/components/ui/text'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_layout/income_statement/',
)({
  component: IncomeStatement,
})

const revenueData = [
  {
    type: 'Merchandise Sales',
    amount: 1000.23,
  },
  { type: 'Subscription Sales', amount: 1000.1 },
  { type: 'Service Sales', amount: 1000.0 },
]

const expenseData = [
  {
    type: 'Payrolls',
    amount: 1000.0,
  },
  {
    type: 'Expense Transactions',
    amount: 1000.0,
  },
  {
    type: 'Account Payables',
    amount: 1000.0,
  },
]

function IncomeStatement() {
  return (
    <div className="p-4 min-h-[85vh] flex gap-4 flex-col items-center">
      <div className="flex items-center w-full md:w-[70vw] justify-between">
        <Text variant={'heading1bold'}>Income Statement</Text>
        <Select>
          <SelectTrigger className={`${text({ variant: 'heading3ghost' })}`}>
            <SelectValue placeholder="Current Month" />
          </SelectTrigger>

          <SelectContent className={`${text({ variant: 'heading3ghost' })}`}>
            <SelectItem value="Current Month">Current Month</SelectItem>
            <SelectItem value="Last Month">Last Month</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-[70vw]">
        <div className="flex flex-col gap-4 items-center md:items-start">
          <Text variant={'heading3bold'}>Revenue</Text>
        </div>
        <DataTable showFooter columns={RevenueColumns} data={revenueData} />
        <div className="flex flex-col gap-4 items-center md:items-start">
          <Text variant={'heading3bold'}>Expense</Text>
        </div>
        <DataTable showFooter columns={ExpenseColumns} data={expenseData} />
      </div>
    </div>
  )
}
