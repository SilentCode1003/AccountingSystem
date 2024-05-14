import { Text } from './ui/text'

import { useState } from 'react'
import { Card } from './ui/card'
import { useSuspenseAccountTypeTotalPerMonth } from '@/hooks/queries'
import MonthPicker from './ui/month-picker'
import { ArrowDownWideNarrowIcon, ArrowUpWideNarrowIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

function AccountTypeTotalCard({ accTypeId }: { accTypeId: string }) {
  const [month, setMonth] = useState<Date>(new Date())

  const accountTypeTotal = useSuspenseAccountTypeTotalPerMonth(month, accTypeId)

  return (
    <>
      {accountTypeTotal.isSuccess && (
        <Card className="p-4 flex-1 flex gap-2 min-w-80">
          <div className="flex flex-col gap-4 items-start">
            <Text variant={'heading3bold'}>
              {accountTypeTotal.data.accountTypeName}{' '}
            </Text>
            {accountTypeTotal.data.total !== null ? (
              <Text variant={'heading3bold'}>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'PHP',
                }).format(Number(accountTypeTotal.data.total))}
              </Text>
            ) : (
              <Text variant={'heading3bold'}> NO DATA FOUND </Text>
            )}
          </div>
          <div className="flex flex-col gap-2 flex-1 ">
            <div className="self-end">
              <MonthPicker currentMonth={month} onMonthChange={setMonth} />
            </div>

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
          </div>
        </Card>
      )}
    </>
  )
}

export default AccountTypeTotalCard
