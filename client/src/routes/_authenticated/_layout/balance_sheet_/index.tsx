import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_layout/balance_sheet/')({
  component: BalanceSheet,
})

function BalanceSheet() {
  return <div>Balance Sheet</div>
}
