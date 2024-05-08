import CashFlowTable from '@/components/CashFlowTable'
import {
  type CashFlow,
  cashFlowColumns,
} from '@/components/table-columns/cashFlow.columns'
import { Text } from '@/components/ui/text'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/_authenticated/_layout/cash_flow/')({
  component: CashFlowComponent,
})

function CashFlowComponent() {
  const [data] = useState<Array<CashFlow>>([
    {
      cfCategory: 'Cash Flow From Operations',
      cfId: '12',
      cfSubCategory: [
        {
          subCatId: '12',
          subCatName: 'Net Earnings',
          subCatValue: 1000,
        },
        {
          subCatId: '12',
          subCatName: 'Subtractions to Cash',
          subCatValue: 1000,
          subCatSubCategory: [
            {
              subCatId: '12',
              subCatName: 'Increase in Inventory',
              subCatValue: 1000,
            },
          ],
        },
        {
          subCatId: '12',
          subCatName: 'Additions to Cash',
          subCatSubCategory: [
            {
              subCatId: '12',
              subCatName: 'Depreciation',
              subCatValue: 1000,
            },
            {
              subCatId: '12',
              subCatName: 'Increase in Accounts Payable',
              subCatValue: 1000,
            },
            {
              subCatId: '12',
              subCatName: 'Increase in Accounts Receivable',
              subCatValue: 1000,
            },
          ],
        },
      ],
    },
  ] as Array<CashFlow>)

  return (
    <div className="p-4 min-h-[85vh] flex gap-4 flex-col items-center">
      <div className="flex flex-col gap-4 items-center w-full md:w-[70vw] justify-between">
        <Text variant={'heading1bold'} className="self-start">
          Cash Flow
        </Text>
        <CashFlowTable
          className="w-full md:w-[70vw]"
          columns={cashFlowColumns}
          data={data}
        />
      </div>
    </div>
  )
}
