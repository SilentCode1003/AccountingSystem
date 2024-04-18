import { CellContext } from '@tanstack/react-table'
import { AccountTypes } from '../table-columns/accountTypes.column'

export const AccountTypeAccountsColumn = ({
  row,
}: CellContext<AccountTypes, unknown>) => {
  return (
    <div className="flex flex-col gap-4">
      {row.original.accounts.length > 0 ? (
        row.original.accounts.map((acc) => (
          <div key={acc.accId}>{acc.accName}</div>
        ))
      ) : (
        <div>No Accounts</div>
      )}
    </div>
  )
}
