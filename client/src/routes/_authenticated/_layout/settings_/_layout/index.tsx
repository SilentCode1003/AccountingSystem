import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { createFileRoute } from '@tanstack/react-router'
import { EyeIcon, EyeOffIcon, UploadIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRef, useState } from 'react'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute(
  '/_authenticated/_layout/settings/_layout/',
)({
  component: Settings,
  pendingComponent: LoadingComponent,
})

function Settings() {
  const [toggleEdit, setToggleEdit] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const queryClient = useQueryClient()

  const imageRef = useRef<HTMLInputElement>(null)

  const user = useSuspenseQuery({
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
          userProfilePic: string
        }
      }>

      return data
    },
  })

  const [userData, setUserData] = useState<{
    fullName: string
    username: string
    password?: string
    profilePic: string | File
    contactNumber: string
  }>({
    fullName: user.data.user.userFullName,
    username: user.data.user.userUsername,
    password: '',
    profilePic: user.data.user.userProfilePic,
    contactNumber: user.data.user.userContactNumber,
  })

  const createUser = useMutation({
    mutationKey: ['createUser'],
    mutationFn: async (payload: FormData) => {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/users`, {
        method: 'PUT',
        credentials: 'include',
        body: payload,
      })
      const data = (await response.json()) as Promise<{
        user: {
          userUsername: string
          userFullName: string
          userContactNumber: string
          userProfilePic: string
        }
      }>
      return data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['userData'],
        (old: {
          user: {
            userUsername: string
            userFullName: string
            userContactNumber: string
            userProfilePic: string
          }
        }) => {
          return {
            user: {
              userUsername: data.user.userUsername,
              userFullName: data.user.userFullName,
              userContactNumber: data.user.userContactNumber,
              userProfilePic: data.user.userProfilePic,
            },
          }
        },
      )
      setToggleEdit(!toggleEdit)
      setUserData({
        fullName: data.user.userFullName,
        username: data.user.userUsername,
        password: '',
        profilePic: data.user.userProfilePic,
        contactNumber: data.user.userContactNumber,
      })
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

    const user = queryClient.getQueryData<{
      isLogged: boolean
      user: {
        userId: string
        userType: string
      }
    }>(['CurrentUser'])

    const fd = new FormData()

    fd.append('userId', user?.user.userId as string)
    fd.append('userUsername', userData.username)
    fd.append('userFullName', userData.fullName)
    fd.append('userContactNumber', userData.contactNumber)
    fd.append('userProfilePic', userData.profilePic as File)

    createUser.mutate(fd)
  }

  const handleToggleEdit = () => {
    setToggleEdit(!toggleEdit)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    if (!e.target.files[0]) return

    setUserData({ ...userData!!, ['profilePic']: e.target.files[0] })
  }

  const handleImageClick = () => {
    imageRef?.current?.click()
  }

  return (
    <div className="flex justify-center lg:justify-start w-full ">
      {user.isSuccess && (
        <div className="flex flex-col items-center gap-40 lg:gap-8 lg:items-start lg:flex-row w-fit">
          <div className="relative">
            <div className="rounded-full overflow-hidden w-40 md:w-64 lg:w-80 aspect-square">
              <img
                src={
                  typeof userData.profilePic === 'string'
                    ? `${import.meta.env.VITE_SERVER_URL}/profilepic/users/${user.data.user.userProfilePic}`
                    : URL.createObjectURL(userData.profilePic as File)
                }
                className="w-40 md:w-64 lg:w-80 aspect-square object-fill"
                alt="https://avatars.githubusercontent.com/u/81360395?v=4"
              />
            </div>
            <Button
              onClick={handleImageClick}
              className="absolute z-10 bottom-5 -right-5 flex gap-4 scale-50 md:-right-3 md:scale-75 lg:right-0 lg:scale-100 w-32 "
              variant={'secondary'}
            >
              Upload <UploadIcon />
            </Button>

            <Input
              type="file"
              className="hidden"
              name=""
              ref={imageRef}
              id=""
              accept="image/jpg, image/jpeg, image/png"
              onChange={handleImageChange}
            />
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
                {user.data.user.userFullName}
              </Text>
              <Input
                name="fullName"
                onChange={handleUserDataChange}
                className={cn(!toggleEdit && 'hidden')}
                value={userData.fullName}
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
                {user.data.user.userUsername}
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
                ********
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
                {user.data.user.userContactNumber}
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

function LoadingComponent() {
  return (
    <div>
      <Skeleton className="" />
    </div>
  )
}