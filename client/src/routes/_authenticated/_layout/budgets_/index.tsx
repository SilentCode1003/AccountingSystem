import DataTable from '@/components/DataTable'
import { budgetsColumns } from '@/components/table-columns/budgets.columns'
import { Text } from '@/components/ui/text'
import { useBudgets } from '@/hooks/queries'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_layout/budgets/')({
  component: BudgetsComponent,
})

function CrudComponents() {
  return <Text variant={'heading1bold'}>Budgets</Text>
}

function BudgetsComponent() {
  // const inventoryEntries = useInventoryEntries()
  const budgets = useBudgets()

  return (
    <div className="p-4 min-h-[85vh] flex flex-col items-center">
      <div className="w-full translate-y-12 md:translate-y-12 sm:w-[70vw] mb-4"></div>
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
    </div>
  )
}
