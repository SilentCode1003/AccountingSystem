import { Row } from '@tanstack/table-core'
import { Liquidations } from '../table-columns/liquidations.columns'
import ExpandedTable from '../ExpandedTable'
import { liquidationsRoutesColumns } from '../table-columns/liquidationRoutes.columns'

export const LiquidationSubComponent = ({
  row,
}: {
  row: Row<Liquidations>
}) => {
  return (
    <ExpandedTable
      columns={liquidationsRoutesColumns}
      data={row.original.liquidationRoutes}
    />
  )
}
