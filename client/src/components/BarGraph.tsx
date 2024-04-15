import randomColor from 'randomcolor'
import {
  Bar,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const rndColor = randomColor({ luminosity: 'light', hue: 'red' })
const salesColor = randomColor({ luminosity: 'light', hue: 'red' })
const totalColor = randomColor({ luminosity: 'light', hue: 'red' })

function BarGraph({
  data,
}: {
  data: Array<{
    name: string
    Sales: number
    'R&D': number
    total: number
  }>
}) {
  return (
    <ResponsiveContainer className="py-4" width="100%" height="100%">
      <ComposedChart data={data} width={350} height={414}>
        <XAxis
          dataKey="name"
          fontSize={12}
          stroke="#888888"
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          tickFormatter={(value) => `$${value}`}
        />
        {/* <Tooltip /> */}
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col">
                      <span
                        className={`text-[0.70rem] uppercase text-[${rndColor}]`}
                      >
                        R&D
                      </span>
                      <span className={`font-bold text-[${rndColor}]`}>
                        {payload[0].value}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Sales
                      </span>
                      <span className="font-bold">{payload[1].value}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Total
                      </span>
                      <span className="font-bold">{payload[2].value}</span>
                    </div>
                  </div>
                </div>
              )
            }

            return null
          }}
        />
        <Legend />
        <Bar
          dataKey="Sales"
          maxBarSize={40}
          radius={[4, 4, 0, 0]}
          stackId={'a'}
          fill={rndColor}
        />
        <Bar
          dataKey="R&D"
          maxBarSize={40}
          radius={[4, 4, 0, 0]}
          stackId={'a'}
          fill={salesColor}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#888888"
          strokeWidth={2}
          activeDot={{
            r: 6,
            style: { fill: totalColor, opacity: 1 },
          }}
          style={{ stroke: totalColor, strokeWidth: 3 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default BarGraph
