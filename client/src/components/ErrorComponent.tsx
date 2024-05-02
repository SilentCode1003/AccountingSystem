import { Card, CardContent, CardHeader } from './ui/card'
import { Text } from './ui/text'
import { TriangleAlertIcon } from 'lucide-react'
import { Button } from './ui/button'
import Header from './Header'
import Footer from './Footer'

function ErrorComponent({
  error,
  resetErrorBoundary,
  router,
}: {
  router?: any
  resetErrorBoundary: Function
  error: any
}) {
  // resetErrorBoundary()
  return (
    <>
      <Header />
      <div className="p-4 min-h-[85vh] flex flex-col items-center">
        <div className="w-full mt-10 md:w-[70vw] ">
          <Card>
            <CardContent>
              <CardHeader className="w-full flex flex-col items-center">
                <Text
                  className="text-center flex items-center"
                  variant={'heading2bold'}
                >
                  SOMETHING WENT WRONG!
                  <TriangleAlertIcon
                    size={72}
                    className="[@media(min-width:560px)]:scale-50"
                  />
                </Text>
              </CardHeader>
              <div className="flex flex-col items-center">
                <Text variant={'body'} className="text-center">
                  {error.message}
                </Text>
                <Button
                  variant={'outline'}
                  onClick={() => {
                    resetErrorBoundary(error)
                    router?.history.back()
                  }}
                >
                  Go back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ErrorComponent
