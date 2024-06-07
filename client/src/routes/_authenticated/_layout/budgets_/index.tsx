import CleanTable from '@/components/CleanTable'
import DataTable from '@/components/DataTable'
import { budgetsColumns } from '@/components/table-columns/budgets.columns'
import { employeeBudgetsColumns } from '@/components/table-columns/employeeBudgets.columns'
import { Checkbox } from '@/components/ui/checkbox'
import MonthPicker from '@/components/ui/month-picker'
import { Text } from '@/components/ui/text'
import { useBudgets, useEmployeeBudgets } from '@/hooks/queries'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/_authenticated/_layout/budgets/')({
  component: BudgetsComponent,
})

function CrudComponents() {
  return <Text variant={'heading1bold'}>Budget History</Text>
}

function BudgetsComponent() {
  const [date, setDate] = useState<Date>(new Date())
  const [showTotal, setShowTotal] = useState(true)
  const budgets = useBudgets()

  const employeeBudgets = useEmployeeBudgets({
    date: showTotal ? undefined : date,
  })

  return (
    <div className="p-4 min-h-[85vh] flex flex-col items-center">
      {budgets.isSuccess && (
        <DataTable
          showVisibility
          className="w-full md:w-[70vw]"
          columns={budgetsColumns}
          pageSize={10}
          data={budgets.data.budgets}
          getRowCanExpand={() => true}
          CrudComponents={CrudComponents}
          filter={[
            {
              filterColumn: 'budgetDate',
              filterPlaceHolder: 'Filter by date',
              date: true,
            },
            {
              filterColumn: 'budgetAmount',
              filterPlaceHolder: 'Filter by Amount',
            },
            {
              filterColumn: 'budgetEmpId',
              filterPlaceHolder: 'Filter by employee',
            },
          ]}
        />
      )}
      {employeeBudgets.isSuccess && (
        <div className="w-full md:w-[70vw] flex flex-col gap-4">
          <div className="flex justify-between">
            <Text variant={'heading1bold'} className="text-start">
              Employee Budgets
            </Text>
            <div className="flex gap-4">
              <div className="flex gap-2 items-center">
                <Checkbox
                  checked={showTotal}
                  onCheckedChange={() =>
                    setShowTotal((prev) => {
                      if (prev) setDate(new Date())
                      return !prev
                    })
                  }
                />
                <Text variant={'body'}>Show Total</Text>
              </div>
              {!showTotal && (
                <MonthPicker currentMonth={date} onMonthChange={setDate} />
              )}
            </div>
          </div>
          <CleanTable
            columns={employeeBudgetsColumns}
            data={employeeBudgets.data.employeeBudgets}
            pageSize={10}
          />
        </div>
      )}
    </div>
  )
}
