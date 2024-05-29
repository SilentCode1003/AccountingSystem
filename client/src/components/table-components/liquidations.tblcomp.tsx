import { Row } from '@tanstack/table-core'
import { Liquidations } from '../table-columns/liquidations.columns'
import InventoryEntryProducsTable from '../inventoryEntryProductTable.'
import { liquidationsRoutesColumns } from '../table-columns/liquidationRoutes.columns'

export const LiquidationSubComponent = ({
  row,
}: {
  row: Row<Liquidations>
}) => {
  return (
    <InventoryEntryProducsTable
      columns={liquidationsRoutesColumns}
      data={row.original.liquidationRoutes}
    />
  )
}
