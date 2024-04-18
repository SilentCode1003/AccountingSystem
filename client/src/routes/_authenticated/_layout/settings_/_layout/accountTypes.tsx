import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_layout/settings/_layout/accountTypes',
)({
  component: AccountTypes,
})

function AccountTypes() {
  return <div>accountTypes</div>
}
