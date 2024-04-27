import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_layout/cash_flow/')({
  component: CashFlow,
})

function CashFlow() {
  return <div>cash flow</div>
}
