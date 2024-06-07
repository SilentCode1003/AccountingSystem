import DataTable from '@/components/DataTable'
import { LoadingTable } from '@/components/LoadingComponents'
import { RoutesColumns } from '@/components/table-columns/routes.columns'
import { Text } from '@/components/ui/text'
import { useRoutes } from '@/hooks/queries'
import { routesOptions } from '@/hooks/queries/options'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_layout/settings/_layout/fieldRoutes',
)({
  loader: async ({ context }) => {
    const routes = await context.queryClient.ensureQueryData(routesOptions())
    return { routes }
  },
  component: FieldRoutesComponent,
  pendingComponent: LoadingComponent,
})

function LoadingComponent() {
  return (
    <div className="p-4 w-full flex flex-col gap-8 items-center min-h-[85vh]">
      <LoadingTable />
    </div>
  )
}

const CrudComponents = () => {
  return (
    <div className="flex flex-col gap-4">
      <Text variant={'heading1bold'}>Routes</Text>
    </div>
  )
}

function FieldRoutesComponent() {
  const routes = useRoutes()

  return (
    <div className="w-full ">
      {routes.isSuccess && (
        <DataTable
          columns={RoutesColumns}
          data={routes.data?.routes}
          pageSize={10}
          filter={[
            {
              filterColumn: 'routeStart',
              filterPlaceHolder: 'filter by route start',
            },
            {
              filterColumn: 'routeEnd',
              filterPlaceHolder: 'filter by route end',
            },
            {
              filterColumn: 'routePrice',
              filterPlaceHolder: 'filter by route price',
            },
            {
              filterColumn: 'routeModeOfTransport',
              filterPlaceHolder: 'filter by mode of transport',
            },
          ]}
          showVisibility
          CrudComponents={CrudComponents}
        />
      )}
    </div>
  )
}
