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
import { Text } from '@/components/ui/text'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { FrownIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/_authenticated/_layout/balance_sheet/')({
  component: BalanceSheet,
})

function BalanceSheet() {
  const [date, setDate] = useState<Date>(new Date())

  const [accTypes, setAccTypes] = useState<Array<string>>([])

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
        accountTypes: Array<{
          accTypeId: string
          accTypeName: string
          accTypeDefault: string
        }>
      }>

      return data
    },
  })

  useEffect(() => {
    if (accountTypes.isSuccess) {
      setAccTypes(
        accountTypes.data.accountTypes
          .filter((accType) => accType.accTypeDefault === 'BALANCESHEET')
          .map((accType) => accType.accTypeId),
      )
    }
  }, [accountTypes.data])

  const balanceSheet = useQuery({
    queryKey: ['balanceSheet', { month: date.getMonth() }, { accTypes }],

    queryFn: async () => {
      let params = new URLSearchParams({
        month: date.toString(),
      })

      accTypes.map((accType) => {
        params.append('accTypes', accType)
      })

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/others/balanceSheet/?` + params,
        {
          credentials: 'include',
        },
      )

      if (!response.ok) throw new Error()
      const data = (await response.json()) as Promise<
        Array<{
          accTypeId: string
          accTypeName: string
          accounts: Array<{
            accName: string
            amount: number
          }>
        }>
      >
      return data
    },
  })

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
        {balanceSheet.isLoading ? (
          <Text variant={'heading1bold'}>LOADING</Text>
        ) : balanceSheet.isSuccess && balanceSheet.data.length > 0 ? (
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
