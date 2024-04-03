import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_layout/employees/$empId',
)({
  component: EmployeeComponent,
})

function EmployeeComponent() {
  return (
    <div className="p-4 min-h-[85vh]">
      <Card className="pt-4">
        <CardContent>
          <div className="flex flex-col items-center gap-4 ">
            <div className="rounded-md w-64 h-64 overflow-hidden">
              <img src="https://github.com/nestortion.png" alt="" />
            </div>
            <div className="flex flex-col gap-8 max-w-64">
              <div>
                <Text variant={'heading1bold'}>Nestor Gerona</Text>
                <Text variant={'body'}>Software Developer</Text>
              </div>
              <div>
                <Text variant={'body'}>
                  Block 5 Lot 53 Vista Rosa Subdivision Barangay Soro-soro Binan
                  City
                </Text>
                <Text variant={'body'}>09195776662</Text>
                <Text variant={'body'}>geronajr.nestor@gmail.com</Text>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
