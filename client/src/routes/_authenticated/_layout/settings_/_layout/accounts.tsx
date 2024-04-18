import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_layout/settings/_layout/accounts',
)({
  component: Accounts,
})

function Accounts() {
  return <div>accounts</div>
}
