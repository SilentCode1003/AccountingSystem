import DataTable from '@/components/DataTable'
import {
  chequeColumns,
  type Cheques,
} from '@/components/table-columns/cheques.columns'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_layout/cheques/')({
  component: Cheques,
})

function Cheques() {
  const cheques = useQuery({
    queryKey: ['Cheques'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/cheques', {
        credentials: 'include',
      })

      const data = (await response.json()) as Promise<{
        cheques: Array<Cheques>
      }>

      return data
    },
  })

  return (
    <div className="p-4 min-h-[85vh] flex flex-col items-center">
      {cheques.isSuccess && (
        <DataTable
          className="w-full md:w-[70vw]"
          columns={chequeColumns}
          data={cheques.data.cheques}
          filter={[
            {
              filterColumn: 'chqIssueDate',
              filterPlaceHolder: 'Filter Issue Date',
              date: true,
            },
            {
              filterColumn: 'chqAmount',
              filterPlaceHolder: 'Filter Amount',
            },
            {
              filterColumn: 'chqPayeeName',
              filterPlaceHolder: 'Filter by payee name',
            },
            {
              filterColumn: 'chqStatus',
              filterPlaceHolder: 'Filter by status',
              filterValues: ['PENDING', 'APPROVED', 'REJECTED'],
            },
          ]}
        />
      )}
    </div>
  )
}

export default Cheques
