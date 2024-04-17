import DataTable from '@/components/DataTable'
import {
  Asset,
  assetsColumn,
  liabilitiesColumn,
  Liability,
} from '@/components/table-columns/balanceSheet.columns'
import DatePicker from '@/components/ui/DatePicker'
import { Text } from '@/components/ui/text'
import { useQueries } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

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
  const [date, setDate] = useState<Date>(new Date())

  const balanceSheet = useQueries<
    Array<{
      type: string
      amount: number
    }>,
    Error
  >({
    queries: ['Assets', 'Liabilities'].map((accType) => ({
      queryKey: ['BalanceSheet', accType],
      queryFn: async () => {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/others/accountTotal`,
          {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
              accType,
              accCreatedAt: date,
            }),
          },
        )
        const data = await response.json()
        return data
      },
    })),
  })

  return (
    <div className="p-4 min-h-[85vh] flex gap-4 flex-col items-center">
      <div className="flex items-center w-full md:w-[70vw] justify-between">
        <Text variant={'heading1bold'} className="w-full">
          Balance Sheet
        </Text>
        <DatePicker date={date} setDate={setDate} yearMonth />
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
