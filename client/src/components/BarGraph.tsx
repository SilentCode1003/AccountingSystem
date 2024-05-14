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

const colors: any = {
  REVENUE: '#10b981',
  EXPENSE: '#f43f5e',
}
const totalColor = randomColor({ luminosity: 'light', hue: 'red' })

function BarGraph({
  BarChartData,
}: {
  BarChartData: {
    dataKeys: Array<string>
    data: Array<any>
  }
}) {
  return (
    <ResponsiveContainer className="py-4 sm:px-4" width="100%" height="100%">
      <ComposedChart data={BarChartData.data} width={350} height={414}>
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
          width={100}
          tickFormatter={(value) =>
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'PHP',
            }).format(Number(value))
          }
        />
        {/* <Tooltip /> */}
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-3 gap-2">
                    {payload.map((data, index) => (
                      <div className="flex flex-col" key={index}>
                        <span
                          className={`text-[0.70rem] uppercase text-[${colors[data.name as string]}]`}
                        >
                          {data.name}
                        </span>
                        <span
                          className={`font-bold text-[${colors[data.name as string]}]`}
                        >
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'PHP',
                          }).format(Number(data.value))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }

            return null
          }}
        />
        <Legend />

        {BarChartData.dataKeys.map((data, index) => {
          return (
            <Bar
              dataKey={data}
              maxBarSize={80}
              radius={[4, 4, 0, 0]}
              fill={colors[data]}
              key={index}
            />
          )
        })}

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
