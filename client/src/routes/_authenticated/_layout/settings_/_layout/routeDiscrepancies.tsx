import DataTable from '@/components/DataTable'
import { routeDiscrepanciesColumns } from '@/components/table-columns/routeDiscrepancies.columns'
import { RouteDiscrepanciesSubComponent } from '@/components/table-components/routeDiscrepancies.tblcomp'
import { Text } from '@/components/ui/text'
import { useRouteDiscrepancies } from '@/hooks/queries'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_layout/settings/_layout/routeDiscrepancies',
)({
  component: RouteDiscrepanciesComponent,
})

const CrudComponents = () => {
  return (
    <div className="flex flex-col gap-4">
      <Text variant={'heading1bold'}>Route Discrepancies</Text>
    </div>
  )
}

function RouteDiscrepanciesComponent() {
  const routeDiscrepancies = useRouteDiscrepancies()

  return (
    <div className="w-full ">
      {routeDiscrepancies.isSuccess && (
        <DataTable
          columns={routeDiscrepanciesColumns}
          data={routeDiscrepancies.data?.routeDiscrepancies}
          pageSize={10}
          showVisibility
          CrudComponents={CrudComponents}
          getRowCanExpand={() => true}
          renderSubComponent={RouteDiscrepanciesSubComponent}
        />
      )}
    </div>
  )
}

export default RouteDiscrepanciesComponent
