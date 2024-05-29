import DataTable from '@/components/DataTable'
import { liquidationsColumns } from '@/components/table-columns/liquidations.columns'
import { LiquidationSubComponent } from '@/components/table-components/liquidations.tblcomp'
import { Text } from '@/components/ui/text'
import { useLiquidations } from '@/hooks/queries'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_layout/liquidations/')({
  component: LiquidationsComponent,
})

function CrudComponents() {
  return <Text variant={'heading1bold'}>Liquidations</Text>
}

function LiquidationsComponent() {
  // const inventoryEntries = useInventoryEntries()
  const liquidations = useLiquidations()

  return (
    <div className="p-4 min-h-[85vh] flex flex-col items-center">
      <div className="w-full translate-y-12 md:translate-y-12 sm:w-[70vw] mb-4"></div>
      {liquidations.isSuccess && (
        <DataTable
          showVisibility
          className="w-full md:w-[70vw]"
          columns={liquidationsColumns}
          pageSize={10}
          data={liquidations.data.liquidations}
          getRowCanExpand={() => true}
          renderSubComponent={LiquidationSubComponent}
          CrudComponents={CrudComponents}
          filter={[
            {
              filterColumn: 'liquidationDate',
              filterPlaceHolder: 'Filter by date',
              date: true,
            },
            {
              filterColumn: 'liquidationAmount',
              filterPlaceHolder: 'Filter by Amount',
            },
            {
              filterColumn: 'liquidationEmpId',
              filterPlaceHolder: 'Filter by employee',
            },
          ]}
        />
      )}
    </div>
  )
}
