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
    meta: 'Issue Date',
    header: 'Issue Date',
  },
  {
    accessorKey: 'chqPayeeName',
    meta: 'Payee Name',
    header: 'Payee Name',
    cell: ({ row }) => (
      <div className="min-w-32">{row.original.chqPayeeName}</div>
    ),
  },
  {
    accessorKey: 'chqAmount',
    meta: 'Amount',
    header: 'Amount',
    cell: PayeeNameColumn,
  },
  {
    accessorKey: 'chqAccId',
    meta: 'Account',
    header: 'Account',
  },
  {
    accessorKey: 'chqDescription',
    meta: 'Description',
    header: 'Description',
  },
  {
    accessorKey: 'chqStatus',
    meta: 'Status',
    header: 'Status',
  },
  {
    accessorKey: 'chqCreatedAt',
    meta: 'Created At',
    header: 'Created At',
  },
  {
    accessorKey: 'chqUpdatedAt',
    meta: 'Updated At',
    header: 'Updated At',
    cell: UpdatedAtColumn,
  },
]
