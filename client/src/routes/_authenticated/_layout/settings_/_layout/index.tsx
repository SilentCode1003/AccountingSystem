import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { createFileRoute } from '@tanstack/react-router'
import { EyeIcon, EyeOffIcon, UploadIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export const Route = createFileRoute(
  '/_authenticated/_layout/settings/_layout/',
)({
  component: Settings,
})

function Settings() {
  const [toggleEdit, setToggleEdit] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [userData, setUserData] = useState<{
    fullName: string
    username: string
    password?: string
    contactNumber: string
  }>({
    fullName: '',
    username: '',
    password: '',
    contactNumber: '',
  })

  const queryClient = useQueryClient()

  const user = useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      const userId = queryClient.getQueryData<{
        isLogged: boolean
        user: {
          userId: string
          userType: string
        }
      }>(['CurrentUser'])

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/users/?` +
          new URLSearchParams({ userId: userId?.user.userId as string }),
        {
          credentials: 'include',
        },
      )

      const data = (await response.json()) as Promise<{
        user: {
          userUsername: string
          userFullName: string
          userContactNumber: string
          userProfielPic: string
        }
      }>

      if (data) {
        const userD = (await data).user
        setUserData((da) => ({
          ...da,
          fullName: userD.userFullName,
          username: userD.userUsername,
          contactNumber: userD.userContactNumber,
        }))
      }

      return data
    },
  })

  const handleUserDataChange = (e: any) => {
    setUserData({
      ...userData!!,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = () => {
    if (
      userData.password === '' ||
      userData.fullName === '' ||
      userData.username === '' ||
      userData.contactNumber === ''
    )
      return

    setToggleEdit(!toggleEdit)
    setUserData({
      fullName: '',
      username: '',
      password: '',
      contactNumber: '',
    })
  }

  const handleToggleEdit = () => {
    setToggleEdit(!toggleEdit)
  }

  return (
    <div className="flex justify-center lg:justify-start w-full ">
      {user.isSuccess && (
        <div className="flex flex-col items-center gap-40 lg:gap-8 lg:items-start lg:flex-row w-fit">
          <div className="relative">
            <div className="rounded-full overflow-hidden w-40 md:w-64 lg:w-80 aspect-square">
              <img
                src="https://github.com/nestortion.png"
                className="w-40 md:w-64 lg:w-80 aspect-square object-fill"
                alt=""
              />
            </div>
            <Button
              className="absolute z-10 bottom-5 -right-5 flex gap-4 scale-50 md:-right-3 md:scale-75 lg:right-0 lg:scale-100"
              variant="secondary"
            >
              <UploadIcon />
              Upload
            </Button>
          </div>
          <div className="flex flex-col gap-4 h-full justify-between">
            <div className="flex gap-4 min-h-[38px]">
              <Text
                className="w-[150px] min-w-[150px]"
                variant={'heading2bold'}
              >
                Full Name:
              </Text>
              <Text className={cn(toggleEdit && 'hidden')} variant={'heading2'}>
                Nestor Gerona
              </Text>
              <Input
                name="fullName"
                onChange={handleUserDataChange}
                className={cn(!toggleEdit && 'hidden')}
                value={userData?.fullName}
              />
            </div>
            <div className="flex gap-4 min-h-[38px]">
              <Text
                className="w-[150px] min-w-[150px]"
                variant={'heading2bold'}
              >
                Username:
              </Text>
              <Text className={cn(toggleEdit && 'hidden')} variant={'heading2'}>
                Nestor Gerona
              </Text>
              <Input
                name="username"
                onChange={handleUserDataChange}
                className={cn(!toggleEdit && 'hidden')}
                value={userData?.username}
              />
            </div>
            <div className="flex gap-4 min-h-[38px]">
              <Text
                className="w-[150px] min-w-[150px]"
                variant={'heading2bold'}
              >
                Password:
              </Text>
              <Text className={cn(toggleEdit && 'hidden')} variant={'heading2'}>
                Nestor Gerona
              </Text>
              <div className={cn('relative', !toggleEdit && 'hidden')}>
                <Input
                  name="password"
                  onChange={handleUserDataChange}
                  type={showPassword ? 'text' : 'password'}
                  value={userData?.password}
                />
                <EyeIcon
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn(
                    'hover:cursor-pointer absolute top-1/2 right-2 -translate-y-1/2',
                    !showPassword && 'hidden',
                  )}
                />
                <EyeOffIcon
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn(
                    'hover:cursor-pointer absolute top-1/2 right-2 -translate-y-1/2',
                    showPassword && 'hidden',
                  )}
                />
              </div>
            </div>
            <div className="flex gap-4 min-h-[38px]">
              <Text
                className="w-[150px] min-w-[150px]"
                variant={'heading2bold'}
              >
                Contact #:
              </Text>
              <Text className={cn(toggleEdit && 'hidden')} variant={'heading2'}>
                Nestor Gerona
              </Text>
              <Input
                name="contactNumber"
                onChange={handleUserDataChange}
                className={cn(!toggleEdit && 'hidden')}
                value={userData?.contactNumber}
              />
            </div>
            <Button
              className={cn(toggleEdit && 'hidden')}
              onClick={handleToggleEdit}
            >
              Edit Profile
            </Button>
            <div className={cn('flex gap-4', !toggleEdit && 'hidden')}>
              <Button
                variant={'secondary'}
                className="flex-1"
                onClick={handleSubmit}
              >
                Save
              </Button>
              <Button
                variant={'outline'}
                className="flex-1"
                onClick={handleToggleEdit}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
