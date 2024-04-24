import { Text } from './ui/text'

import PieChart from './PieChart'
import randomColor from 'randomcolor'
import { RxDotFilled } from 'react-icons/rx'
import { useState } from 'react'
import { Card } from './ui/card'
import { useAccountTypeTotalPerMonth } from '@/hooks/queries'
import MonthPicker from './ui/month-picker'

function Expenses({ accTypeId }: { accTypeId: string }) {
  const [month, setMonth] = useState<Date>(new Date())

  const accountTypeTotal = useAccountTypeTotalPerMonth(month, accTypeId)

  return (
    <>
      <Card className="p-4 min-h-[310px]">
        {accountTypeTotal.isSuccess && (
          <>
            <div className="flex justify-between w-full">
              <Text variant={'heading3bold'}>
                {accountTypeTotal.data.accountTypeName
                  .concat('s')
                  .toUpperCase()}
              </Text>
              <div className="flex items-center">
                <MonthPicker currentMonth={month} onMonthChange={setMonth} />
              </div>
            </div>
            {accountTypeTotal.data.accounts.length > 0 ? (
              <div className="flex gap-4s">
                <div className="flex flex-col justify-start">
                  <div className="w-fit">
                    <Text variant={'heading3bold'}>
                      ₱
                      {accountTypeTotal.data.accounts.reduce(
                        (acc, val) => acc + parseFloat(String(val.total)),
                        0,
                      )}
                    </Text>
                    <Text variant={'heading3ghost'}>Current Month</Text>
                  </div>
                  <div>
                    <PieChart
                      data={accountTypeTotal.data.accounts.map((d) => {
                        return {
                          name: d.name,
                          value: parseFloat(String(d.total)),
                          color: randomColor({
                            hue: 'red',
                            luminosity: 'light',
                          }),
                        }
                      })}
                    />
                  </div>
                </div>
                <div className="mt-8">
                  {accountTypeTotal.data.accounts
                    .map((d) => {
                      return {
                        name: d.name,
                        value: d.total,
                        color: randomColor({ hue: 'red', luminosity: 'light' }),
                      }
                    })
                    .map((d, index) => (
                      <div key={index} className="flex flex-col">
                        <div className="flex items-center">
                          <RxDotFilled size={20} color={d.color} />
                          <Text variant={'heading4bold'}>₱{d.value}</Text>
                        </div>
                        <Text className="ml-4" variant={'body'}>
                          {d.name}
                        </Text>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <Text className="text-center w-full h-full " variant={'heading2'}>
                No Data Available
              </Text>
            )}
          </>
        )}
      </Card>
    </>
  )
}

export default Expenses
