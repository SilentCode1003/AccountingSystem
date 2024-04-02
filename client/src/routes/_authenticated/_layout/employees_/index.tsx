import DataTable from '@/components/DataTable'
import {
  employeeColumns,
  type Employees,
} from '@/components/table-columns/employees.columns'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_layout/employees/')({
  component: Employees,
})

function Employees() {
  const employees = useQuery({
    queryKey: ['Employees'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/employees', {
        credentials: 'include',
      })
      const data = (await response.json()) as Promise<{
        employees: Array<Employees>
      }>

      return data
    },
  })

  return (
    <div className="p-4 min-h-[85vh] flex flex-col items-center">
      {employees.isSuccess && (
        <DataTable
          className="w-full md:w-[70vw]"
          columns={employeeColumns}
          data={employees.data.employees}
        ></DataTable>
      )}
    </div>
  )
}

export default Employees
