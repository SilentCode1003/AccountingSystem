import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_layout/employees/$empId',
)({
  component: () => <div>Hello /_authenticated/_layout/employees/$empId!</div>,
})
