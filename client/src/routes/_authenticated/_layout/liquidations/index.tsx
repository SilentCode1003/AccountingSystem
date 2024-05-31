import DataTable from '@/components/DataTable'
import ExpandedTable from '@/components/ExpandedTable'
import { liquidationsRoutesColumns } from '@/components/table-columns/liquidationRoutes.columns'
import {
  Liquidations,
  liquidationsColumns,
} from '@/components/table-columns/liquidations.columns'
import { LiquidationSubComponent } from '@/components/table-components/liquidations.tblcomp'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { useLiquidations } from '@/hooks/queries'
import { cn } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export const Route = createFileRoute('/_authenticated/_layout/liquidations/')({
  component: LiquidationsComponent,
})

function CrudComponents() {
  return <Text variant={'heading1bold'}>Liquidations</Text>
}

function LiquidationsComponent() {
  const liquidations = useLiquidations()

  const [leftLastDroppedItem, setLeftLastDroppedItem] = useState<Liquidations>()
  const [rightLastDroppedItem, setRightLastDroppedItem] =
    useState<Liquidations>()

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 min-h-[85vh] flex flex-col items-center">
        <div className="w-full translate-y-12 md:translate-y-12 sm:w-[70vw] mb-4"></div>
        {liquidations.isSuccess && (
          <DataTable
            canDrag
            showVisibility
            setLeftLastDroppedItem={setLeftLastDroppedItem}
            setRightLastDroppedItem={setRightLastDroppedItem}
            className="w-full md:w-[70vw]"
            columns={liquidationsColumns}
            pageSize={5}
            data={liquidations.data.liquidations}
            getRowCanExpand={() => true}
            renderSubComponent={LiquidationSubComponent}
            CrudComponents={CrudComponents}
            filter={[
              {
                filterColumn: 'liquidationDate',
                filterPlaceHolder: 'Filter by date',
                date: true,
              },
              {
                filterColumn: 'liquidationAmount',
                filterPlaceHolder: 'Filter by Amount',
              },
              {
                filterColumn: 'liquidationEmpId',
                filterPlaceHolder: 'Filter by employee',
              },
            ]}
          />
        )}
        <Text variant={'heading1bold'} className="my-4">
          Compare Routes
        </Text>
        <Button
          onClick={() => {
            setLeftLastDroppedItem(undefined)
            setRightLastDroppedItem(undefined)
          }}
          variant={'secondary'}
        >
          Clear Routes
        </Button>
        <div className="w-[70vw] flex gap-4 mt-4">
          <CardContainer
            name={'leftCompare'}
            lastDroppedItem={leftLastDroppedItem}
          />
          <CardContainer
            name={'rightCompare'}
            lastDroppedItem={rightLastDroppedItem}
          />
        </div>
      </div>
    </DndProvider>
  )
}

const CardContainer = ({
  lastDroppedItem,
  name,
}: {
  lastDroppedItem?: Liquidations
  name: string
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'CARD',
    drop: () => ({ name }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  const isActive = canDrop && isOver

  return (
    <Card ref={drop} className="w-full h-[50vh] p-4">
      <Text variant={'heading1bold'}>Add Liquidation</Text>
      {isActive ? (
        <Text
          variant={'heading3bold'}
          className={cn(
            'w-full h-full flex justify-center items-center',
            lastDroppedItem && 'hidden',
          )}
        >
          Release to drop
        </Text>
      ) : (
        <Text
          variant={'heading3bold'}
          className={cn(
            'w-full h-full flex justify-center items-center',
            lastDroppedItem && 'hidden',
          )}
        >
          Drag a liquidation route here
        </Text>
      )}
      {lastDroppedItem && (
        <Text variant={'heading1bold'} className="mt-4">
          <ExpandedTable
            columns={liquidationsRoutesColumns}
            data={lastDroppedItem.liquidationRoutes}
          />
        </Text>
      )}
      {lastDroppedItem && (
        <>
          <div className="flex gap-4">
            <Text variant={'heading4bold'}>Date</Text>
            <Text variant={'body'}>
              {new Date(lastDroppedItem.liquidationDate).toLocaleDateString()}
            </Text>
          </div>
          <div className="flex gap-4">
            <Text variant={'heading4bold'}>Employee Name:</Text>
            <Text variant={'body'}>{lastDroppedItem.employee.empName}</Text>
          </div>
        </>
      )}
    </Card>
  )
}
