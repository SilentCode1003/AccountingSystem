import {
  Cell,
  Pie,
  PieChart as RechartPie,
  Tooltip,
  TooltipProps,
} from 'recharts'
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent'

const CustomToolTip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) =>
  active &&
  payload && (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="flex justify-center">
        <div className="flex flex-col items-center">
          <span className="text-[0.70rem] uppercase text-muted-foreground">
            {payload[0].name}
          </span>
          <span className="font-bold text-muted-foreground">
            {payload[0].value}
          </span>
        </div>
      </div>
    </div>
  )

function PieChart({
  data,
}: {
  data: Array<{
    name: string
    color: string
    value: number
  }>
}) {
  return (
    <RechartPie width={200} height={180}>
      <Pie
        data={data}
        dataKey="value"
        cx="30%"
        cy="50%"
        innerRadius={30}
        outerRadius={60}
        blendStroke={false}
        labelLine={false}
        stroke="none"
      >
        {data.map((d, index) => (
          <Cell key={index} fill={d.color} className="outline-none" />
        ))}
      </Pie>
      <Tooltip content={CustomToolTip} />
    </RechartPie>
  )
}

export default PieChart
