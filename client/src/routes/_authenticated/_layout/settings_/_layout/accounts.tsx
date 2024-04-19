import DataTable from '@/components/DataTable'
import {
  Accounts,
  accountsColumns,
} from '@/components/table-columns/accounts.columns'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_layout/settings/_layout/accounts',
)({
  component: AccountsComponent,
})

function AccountsComponent() {
  const accounts = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/accounts`,
        {
          credentials: 'include',
        },
      )

      const data = (await response.json()) as Promise<{
        accounts: Array<Accounts>
      }>

      return data
    },
  })

  return (
    <div>
      {accounts.isSuccess && (
        <DataTable
          columns={accountsColumns}
          data={accounts.data.accounts}
          pageSize={20}
          showVisibility
        />
      )}
    </div>
  )
}
