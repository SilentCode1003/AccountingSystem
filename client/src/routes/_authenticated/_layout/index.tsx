import AccountTypeBarChart from '@/components/AccountTypeBarChart'
import AccountTypeTotalCard from '@/components/AccountTypeTotalCard'
import RecentTransactions from '@/components/RecentTransactions'
import { recentTransactionsColumns } from '@/components/table-columns/transactions.columns'
import { Card } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { useAccountTypes, useTransactions } from '@/hooks/queries'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_layout/')({
  component: Home,
  pendingComponent: LoadingComponent,
})

function LoadingComponent() {
  return <></>
}

function Home() {
  const accountTypes = useAccountTypes()
  const transactions = useTransactions()

  return (
    <div className="max-h-[85vh] px-4 overflow-y-auto w-screens">
      <div className="border-b-2 border-foreground pb-4 mb-4 mt-4">
        <Text variant={'heading1bold'}>Dashboard</Text>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
          {accountTypes.isSuccess &&
            accountTypes.data.accountTypes.map((accountType) => (
              <AccountTypeTotalCard
                accTypeId={accountType.accTypeId}
                key={accountType.accTypeId}
              />
            ))}
        </div>
        <div>
          <AccountTypeBarChart />
        </div>
        <div>
          {transactions.isSuccess && (
            <Card className="p-4">
              <RecentTransactions
                showVisibility
                pageSize={3}
                className="w-full "
                columns={recentTransactionsColumns}
                CrudComponents={() => (
                  <Text variant={'heading3bold'}>Recent Transactions</Text>
                )}
                data={transactions.data.transactions}
                filter={[
                  {
                    filterColumn: 'tranAmount',
                    filterPlaceHolder: 'Filter by Transaction Amount',
                  },
                  {
                    filterColumn: 'tranPartner',
                    filterPlaceHolder: 'Filter by Transaction Partner',
                  },
                  {
                    filterColumn: 'tranTransactionDate',
                    filterPlaceHolder: 'Filter Transac Date',
                    date: true,
                  },
                ]}
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
