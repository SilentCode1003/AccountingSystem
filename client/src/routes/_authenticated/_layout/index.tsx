import Expenses from '@/components/Expenses'
import Revenues from '@/components/Revenues'
import { Text } from '@/components/ui/text'
import { useAccountTypes } from '@/hooks/queries'
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

  return (
    <div className="max-h-[85vh] px-4 overflow-y-auto w-screens">
      <div className="border-b-2 border-foreground pb-4 mb-4">
        <Text variant={'heading1bold'}>Dashboard</Text>
      </div>
      <div className="flex flex-col md:grid md:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-4">
        {accountTypes.isSuccess &&
          accountTypes.data.accountTypes.map((accountType, index) =>
            index / 2 === 0 ? (
              <Expenses
                key={accountType.accTypeId}
                accTypeId={accountType.accTypeId}
              />
            ) : (
              <Revenues
                accTypeId={accountType.accTypeId}
                key={accountType.accTypeId}
              />
            ),
          )}
      </div>
    </div>
  )
}
