import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_layout/reports/')({
  component: () => <div>Hello /_authenticated/_layout/reports/!</div>
})