import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_layout/settings/_layout/',
)({
  component: Settings,
})

function Settings() {
  return <div>General</div>
}
