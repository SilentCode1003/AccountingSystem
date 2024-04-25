import { Text } from './ui/text'
import BarGraph from './BarGraph'
import { Card } from './ui/card'
import { useCashFlowBarChartData } from '@/hooks/queries'

function AccountTypeBarChart() {
  const data = useCashFlowBarChartData()

  return (
    <Card className="h-[414px] p-4 md:col-auto">
      <div>
        <Text variant={'heading3bold'}>Cash Flow</Text>
      </div>
      {data.isSuccess && (
        <BarGraph
          BarChartData={{
            data: data.data.data,
            dataKeys: data.data.dataKeys,
          }}
        />
      )}
    </Card>
  )
}

export default AccountTypeBarChart
