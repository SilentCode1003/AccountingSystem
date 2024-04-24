import { Text } from './ui/text'
import BarGraph from './BarGraph'
import { Card } from './ui/card'
import { useAccountTypeBarChartData } from '@/hooks/queries'

function Revenues({ accTypeId }: { accTypeId: string }) {
  const data = useAccountTypeBarChartData(accTypeId)

  return (
    <Card className="h-[414px] p-4 md:col-span-2">
      <div>
        <Text variant={'heading3bold'}>REVENUES</Text>
      </div>
      {data.isSuccess && <BarGraph data={data.data.data} />}
    </Card>
  )
}

export default Revenues
