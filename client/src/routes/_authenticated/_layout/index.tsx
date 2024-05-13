import AccountTypeBarChart from '@/components/AccountTypeBarChart'
import AccountTypeTotalCard from '@/components/AccountTypeTotalCard'
import RecentTransactions from '@/components/RecentTransactions'
import { recentTransactionsColumns } from '@/components/table-columns/transactions.columns'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Text } from '@/components/ui/text'
import { useAccountTypes, useTransactions } from '@/hooks/queries'
import { transactionsOptions } from '@/hooks/queries/options'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_layout/')({
  loader: async ({ context }) => {
    const transactions = await context.queryClient.ensureQueryData(
      transactionsOptions(),
    )
    return { transactions }
  },
  component: Home,
  pendingComponent: LoadingComponent,
})

function LoadingComponent() {
  return (
    <div className="p-4  flex flex-col gap-8 items-center min-h-[85vh]">
      <div className="flex gap-4 w-full">
        <Skeleton className="flex-1 h-[106px]" />
        <Skeleton className="flex-1 h-[106px]" />
        <Skeleton className="flex-1 h-[106px]" />
      </div>
      <div className="w-full">
        <Skeleton className="h-[414px] w-full" />
      </div>
      <div className="w-full flex flex-col gap-4">
        <Skeleton className=" w-full h-80" />
      </div>
    </div>
  )
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
                data={transactions.data.transactions.slice(0, 3)}
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
