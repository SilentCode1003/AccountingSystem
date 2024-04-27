import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_layout/settings/_layout/reports',
)({
  component: Reports,
})

function Reports() {
  return <div>reports</div>
}
