import { ColumnDef } from '@tanstack/react-table'

import {
  PayeeNameColumn,
  UpdatedAtColumn,
} from '../table-components/cheques.tblcomp'

export type Cheques = {
  chqPayeeName: string
  chqAmount: number
  chqIssueDate: string
  chqDescription: string
  chqStatus: 'APPROVED' | 'PENDING' | 'REJECTED'
  chqAccId: string
  chqCreatedAt: string
  chqUpdatedAt: string
}

export const chequeColumns: ColumnDef<Cheques>[] = [
  {
    accessorKey: 'chqIssueDate',
    header: 'Issue Date',
  },
  {
    accessorKey: 'chqPayeeName',
    header: 'Payee Name',
    cell: ({ row }) => (
      <div className="min-w-32">{row.original.chqPayeeName}</div>
    ),
  },
  {
    accessorKey: 'chqAmount',
    header: 'Amount',
    cell: PayeeNameColumn,
  },
  {
    accessorKey: 'chqAccId',
    header: 'Account Id',
  },
  {
    accessorKey: 'chqDescription',
    header: 'Description',
  },
  {
    accessorKey: 'chqStatus',
    header: 'Status',
  },
  {
    accessorKey: 'chqCreatedAt',
    header: 'Created At',
  },
  {
    accessorKey: 'chqUpdatedAt',
    header: 'Updated At',
    cell: UpdatedAtColumn,
  },
]
