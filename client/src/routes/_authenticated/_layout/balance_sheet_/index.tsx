import DataTable from '@/components/DataTable'
import { assetsColumn } from '@/components/table-columns/balanceSheet.columns'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import MonthPicker from '@/components/ui/month-picker'
import { Skeleton } from '@/components/ui/skeleton'
import { Text } from '@/components/ui/text'
import {
  useAccountTypesSuspense,
  useBalanceSheetSuspense,
} from '@/hooks/queries'
import { createFileRoute } from '@tanstack/react-router'
import { FrownIcon } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/_authenticated/_layout/balance_sheet/')({
  component: BalanceSheet,
  pendingComponent: () => (
    <div className="p-4 min-h-[85vh] flex gap-4 flex-col items-center">
      <div className="flex flex-col gap-4 items-center w-full md:w-[70vw] justify-between">
        <LoadingComponent />
        <LoadingComponent />
      </div>
    </div>
  ),
})

function BalanceSheet() {
  const [date, setDate] = useState<Date>(new Date())

  const accountTypes = useAccountTypesSuspense()

  const [accTypes, setAccTypes] = useState<Array<string>>(
    accountTypes.data.accountTypes
      .filter((accType) => accType.accTypeDefault === 'BALANCESHEET')
      .map((accType) => accType.accTypeId),
  )

  const balanceSheet = useBalanceSheetSuspense(date, accTypes)

  const handleAccTypeChange = (
    check: boolean,
    accType: {
      accTypeId: string
      accTypeName: string
    },
  ) => {
    if (check) {
      setAccTypes([...accTypes, accType.accTypeId])
    } else {
      setAccTypes(
        accTypes.filter((accTypeId) => accTypeId !== accType.accTypeId),
      )
    }
  }

  return (
    <div className="p-4 min-h-[85vh] flex gap-4 flex-col items-center">
      <div className="flex items-center w-full md:w-[70vw] justify-between">
        <Text variant={'heading1bold'}>Balance Sheet</Text>
        <div className="flex flex-col gap-4 md:flex-row">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Account Types</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 ">
              {accountTypes.isSuccess &&
                accountTypes.data.accountTypes.map((accType) => (
                  <DropdownMenuCheckboxItem
                    checked={accTypes.includes(accType.accTypeId)}
                    key={accType.accTypeId}
                    onCheckedChange={(check) =>
                      handleAccTypeChange(check, accType)
                    }
                  >
                    {accType.accTypeName}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <MonthPicker currentMonth={date} onMonthChange={setDate} />
        </div>
      </div>
      <div className="w-full md:w-[70vw]">
        {balanceSheet.isSuccess && balanceSheet.data.length > 0 ? (
          balanceSheet.data.map((balanceSheet) => (
            <div key={balanceSheet.accTypeId}>
              <div className="flex flex-col gap-4 items-center md:items-start">
                <Text variant={'heading3bold'}>{balanceSheet.accTypeName}</Text>
              </div>
              <DataTable
                showFooter
                columns={assetsColumn}
                data={balanceSheet.accounts}
              />
            </div>
          ))
        ) : (
          <Text
            variant={'heading1bold'}
            className="flex gap-2 items-center text-center justify-center w-full"
          >
            NO RECORDS TO SHOW <FrownIcon size={80} />
          </Text>
        )}
      </div>
    </div>
  )
}

function LoadingComponent() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Skeleton className="h-[1.25rem] w-[150px] rounded-md" />
      <Skeleton className="h-[218px] w-full rounded-md" />
    </div>
  )
}
