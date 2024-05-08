import { cn } from '@/lib/utils'
import { ColumnDef } from '@tanstack/table-core'
import { Text } from '../ui/text'

export type CashFlow = {
  cfId: string
  cfCategory: string
  cfSubCategory?: Array<CashFlowSub>
}

export type CashFlowSub = {
  subCatId: string
  subCatName: string
  subCatValue: number
  subCatSubCategory?: Array<CashFlowSub>
}

export const cashFlowColumns: ColumnDef<CashFlow>[] = [
  {
    id: 'Cash Flow Header',
    header: () => {
      return (
        <Text variant={'heading2bold'} className="w-full text-center">
          CASH FLOW FOR FINANCIAL YEAR 2024
        </Text>
      )
    },
    columns: [
      {
        accessorKey: 'cfCategory',
        meta: 'Cash Flow Name',
        accessorFn: (row) => {
          return (row as CashFlow & CashFlowSub).subCatName ?? row.cfCategory
        },
        header: () => 'Category',
        cell: ({ row, getValue }) => {
          return (
            <div className={cn(row.depth > 0 && `pl-[${row.depth * 2}rem]`)}>
              {getValue<boolean>()}
            </div>
          )
        },
      },
      {
        accessorKey: 'cfValue',
        meta: 'Cash Flow Amount',
        accessorFn: (row) => (row as CashFlow & CashFlowSub).subCatValue,
        header: () => 'Amount',
        cell: ({ getValue }) => getValue() ?? undefined,
      },
    ],
  },
]
