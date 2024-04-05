import DataTable from '@/components/DataTable'
import {
  payrollColumns,
  type Payrolls,
} from '@/components/table-columns/payrolls.columns'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_layout/payrolls/')({
  component: Payrolls,
})

function Payrolls() {
  const payrolls = useQuery({
    queryKey: ['payrolls'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/payrolls', {
        credentials: 'include',
      })
      const data = (await response.json()) as Promise<{
        payrolls: Array<Payrolls>
      }>
      return data
    },
  })
  return (
    <div className="p-4 min-h-[85vh] flex flex-col items-center">
      {payrolls.isSuccess && (
        <DataTable
          className="w-full md:w-[70vw]"
          columns={payrollColumns}
          data={payrolls.data.payrolls}
          filter={[
            {
              filterColumn: 'prEmpName',
              filterPlaceHolder: 'Filter employee name',
            },
            {
              filterColumn: 'prFinalAmount',
              filterPlaceHolder: 'Filter total amount',
            },
            {
              filterColumn: 'prDateFrom',
              filterPlaceHolder: 'Filter Date From',
              date: true,
            },
            {
              filterColumn: 'prDateTo',
              filterPlaceHolder: 'Filter Date To',
              date: true,
            },
          ]}
        />
      )}
    </div>
  )
}

export default Payrolls
