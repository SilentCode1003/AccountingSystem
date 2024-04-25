import { Text } from './ui/text'
import BarGraph from './BarGraph'
import { Card } from './ui/card'
import { useSuspenseCashFlowBarChartData } from '@/hooks/queries'

function AccountTypeBarChart() {
  const data = useSuspenseCashFlowBarChartData()

  return (
    <Card className="h-[414px] p-4 md:col-auto">
      <div>
        <Text variant={'heading3bold'}>Cash Flow</Text>
      </div>
      <BarGraph
        BarChartData={{
          data: data.data.data,
          dataKeys: data.data.dataKeys,
        }}
      />
    </Card>
  )
}

export default AccountTypeBarChart
