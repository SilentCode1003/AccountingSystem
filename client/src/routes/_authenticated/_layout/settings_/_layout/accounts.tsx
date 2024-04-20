import DataTable from '@/components/DataTable'
import { accountsColumns } from '@/components/table-columns/accounts.columns'
import { useAccounts } from '@/hooks/queries'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_layout/settings/_layout/accounts',
)({
  component: AccountsComponent,
})

function AccountsComponent() {
  const accounts = useAccounts()

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
