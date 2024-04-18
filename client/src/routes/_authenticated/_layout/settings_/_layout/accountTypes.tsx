import DataTable from '@/components/DataTable'
import {
  accountTypeColumn,
  AccountTypes,
} from '@/components/table-columns/accountTypes.column'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_layout/settings/_layout/accountTypes',
)({
  component: AccountTypesComponent,
})

function AccountTypesComponent() {
  const accountTypes = useQuery({
    queryKey: ['accountTypes'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/accountTypes`,
        {
          credentials: 'include',
        },
      )
      const data = (await response.json()) as Promise<{
        accountTypes: Array<AccountTypes>
      }>

      return data
    },
  })

  return (
    <div>
      {accountTypes.isSuccess && (
        <DataTable
          columns={accountTypeColumn}
          data={accountTypes.data.accountTypes}
          pageSize={10}
          showVisibility
        />
      )}
    </div>
  )
}
