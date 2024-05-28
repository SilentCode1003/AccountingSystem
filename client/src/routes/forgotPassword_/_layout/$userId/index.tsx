import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/forgotPassword/_layout/$userId/')({
  component: forgetPasswordUserIdComponent,
})

function forgetPasswordUserIdComponent() {
  const params = Route.useParams()

  return <div>Hello /forgotPassword/_layout/$userId/!</div>
}

export default forgetPasswordUserIdComponent
