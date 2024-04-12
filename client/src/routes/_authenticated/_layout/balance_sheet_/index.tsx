import DataTable from '@/components/DataTable'
import {
  Asset,
  assetsColumn,
  liabilitiesColumn,
  Liability,
} from '@/components/table-columns/balanceSheet.columns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { text, Text } from '@/components/ui/text'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_layout/balance_sheet/')({
  component: BalanceSheet,
})

const assetsData: Array<Asset> = [
  {
    type: 'Cash',
    amount: 100000,
  },
  { type: 'Accounts Receivables', amount: 20000 },
  { type: 'Inventory', amount: 30000 },
]

const liabilitiesData: Array<Liability> = [
  {
    type: 'Accounts Payable',
    amount: 100000,
  },
  { type: 'Accumulated Expenses', amount: 20000 },
]

function BalanceSheet() {
  return (
    <div className="p-4 min-h-[85vh] flex gap-4 flex-col items-center">
      <div className="flex items-center w-full md:w-[70vw] justify-between">
        <Text variant={'heading1bold'}>Balance Sheet</Text>
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
          <Text variant={'heading3bold'}>Assets</Text>
        </div>
        <DataTable showFooter columns={assetsColumn} data={assetsData} />
        <div className="flex flex-col gap-4 items-center md:items-start">
          <Text variant={'heading3bold'}>Liabilities</Text>
        </div>
        <DataTable
          showFooter
          columns={liabilitiesColumn}
          data={liabilitiesData}
        />
      </div>
    </div>
  )
}
