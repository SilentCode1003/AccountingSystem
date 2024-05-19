import { Text } from './ui/text'
import { Card } from './ui/card'
import { useAccountTypeTotalPerMonth } from '@/hooks/queries'
import { ArrowDownWideNarrowIcon, ArrowUpWideNarrowIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from './ui/skeleton'

function AccountTypeTotalCard({
  accTypeId,
  month,
}: {
  month: Date
  accTypeId: string
}) {
  const accountTypeTotal = useAccountTypeTotalPerMonth(month, accTypeId)

  if (accountTypeTotal.isLoading) return <Skeleton className="min-w-80 h-24" />

  return (
    <>
      {accountTypeTotal.isSuccess && (
        <Card className="p-4 flex-1 flex gap-2 min-w-80">
          <div className="flex flex-col gap-4 items-start">
            <Text variant={'heading3bold'}>
              {accountTypeTotal.data.accountTypeName}{' '}
            </Text>
            {accountTypeTotal.data.total !== null ? (
              <Text
                variant={'heading3bold'}
                className="flex gap-4 items-center"
              >
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'PHP',
                }).format(Number(accountTypeTotal.data.total))}
                {accountTypeTotal.data.total !== null && (
                  <div
                    className={cn(
                      'flex gap-2 text-xs',
                      accountTypeTotal.data.percentAgainstPrevMonth < 0
                        ? 'text-red-500'
                        : 'text-green-500',
                    )}
                  >
                    {accountTypeTotal.data.percentAgainstPrevMonth < 0 ? (
                      <ArrowDownWideNarrowIcon size={16} />
                    ) : (
                      <ArrowUpWideNarrowIcon size={16} />
                    )}
                    {accountTypeTotal.data.percentAgainstPrevMonth.toFixed(2)}%
                  </div>
                )}
              </Text>
            ) : (
              <Text variant={'heading3bold'}> NO DATA FOUND </Text>
            )}
          </div>
        </Card>
      )}
    </>
  )
}

export default AccountTypeTotalCard
