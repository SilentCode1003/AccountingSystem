import DataTable from '@/components/DataTable'
import { LoadingTable } from '@/components/LoadingComponents'
import { accountsColumns } from '@/components/table-columns/accounts.columns'
import { useAccounts } from '@/hooks/queries'
import { accountsOptions } from '@/hooks/queries/options'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_layout/settings/_layout/accounts',
)({
  loader: async ({ context }) => {
    const accounts =
      await context.queryClient.ensureQueryData(accountsOptions())
    return { accounts }
  },
  component: AccountsComponent,
  pendingComponent: LoadingComponent,
})

function LoadingComponent() {
  return (
    <div className="p-4 w-full flex flex-col gap-8 items-center min-h-[85vh]">
      <LoadingTable />
    </div>
  )
}

function AccountsComponent() {
  const accounts = useAccounts()

  return (
    <div className="w-full">
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
