import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useLogout } from '@/hooks/mutations'
import { useUser } from '@/hooks/queries'
import { Link } from '@tanstack/react-router'
import {
  ArchiveIcon,
  ArrowLeftRightIcon,
  BookMinusIcon,
  BookPlusIcon,
  BookTextIcon,
  HandCoinsIcon,
  HomeIcon,
  LogOutIcon,
  MoonIcon,
  ReceiptIcon,
  SettingsIcon,
  UsersRoundIcon,
} from 'lucide-react'
import { RxHamburgerMenu } from 'react-icons/rx'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Skeleton } from './ui/skeleton'
import { Switch } from './ui/switch'
import { Text } from './ui/text'
import { useTheme } from './ui/theme.provider'

function LoadingComponent() {
  return (
    <div className="h-[10vh] shadow-md bg-background max-w-screen  z-[10] p-4 top-0 sticky flex justify-between">
      <div className="flex gap-4">
        <Skeleton className="w-10 h-10" />
        <Skeleton className="w-20 h-8" />
      </div>
      <div>
        <Skeleton className="aspect-square w-10 rounded-full" />
      </div>
    </div>
  )
}

function Header() {
  const { setTheme, theme } = useTheme()

  const user = useUser()

  const logout = useLogout()

  const handleLogout = () => {
    logout.mutate()
  }

  if (user.isLoading) return <LoadingComponent />

  return (
    <header className="h-[10vh] shadow-md bg-background max-w-screen  z-[10] p-4 top-0 sticky ">
      <Sheet>
        <div className="flex">
          <div className="flex-1 flex gap-4">
            <SheetTrigger asChild>
              <div className="hover:cursor-pointer">
                <RxHamburgerMenu size={40} />
              </div>
            </SheetTrigger>
            <Text
              variant={'heading2bold'}
              className="max-w-32 h-fit line-clamp-1 xs:max-w-full xs:line-clamp-0"
            >
              5L Solutions
            </Text>
          </div>

          <div className="flex gap-4">
            <div className="ml-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="hover:cursor-pointer">
                    <Avatar>
                      <AvatarImage
                        src={`${import.meta.env.VITE_SERVER_URL}/profilepic/users/${user.data!.user.userProfilePic}`}
                      />
                      <AvatarFallback>NG</AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  <DropdownMenuLabel>
                    <div className="flex gap-4 items-center">
                      <Avatar>
                        <AvatarImage
                          src={`${import.meta.env.VITE_SERVER_URL}/profilepic/users/${user.data!.user.userProfilePic}`}
                        />
                        <AvatarFallback>NG</AvatarFallback>
                      </Avatar>
                      <div>{user.data!.user.userFullName}</div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/settings">
                    <DropdownMenuItem className="flex gap-4 hover:cursor-pointer">
                      <div>
                        <SettingsIcon />
                      </div>
                      <div>Settings</div>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="flex gap-4 hover:cursor-pointer">
                    <div>
                      <MoonIcon />
                    </div>
                    <div>
                      <Switch
                        checked={theme === 'dark' ? true : false}
                        onCheckedChange={(w) => {
                          w ? setTheme('dark') : setTheme('light')
                        }}
                      />
                    </div>
                  </DropdownMenuItem>
                  <Link to="/login">
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex gap-4 hover:cursor-pointer"
                    >
                      <div>
                        <LogOutIcon />
                      </div>
                      <div>Logout</div>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <SheetContent side={'left'} className="flex flex-col justify-center">
          <Link to="/">
            <SheetClose>
              <Text
                variant={'heading1'}
                style={'underline'}
                className="flex gap-4 items-center"
              >
                <HomeIcon />
                Home
              </Text>
            </SheetClose>
          </Link>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-0">
              <AccordionTrigger hideArrow className="p-0 hover:no-underline">
                <Text
                  variant={'heading1'}
                  style={'underline'}
                  className="flex gap-4 items-center"
                >
                  <BookTextIcon />
                  Statements
                </Text>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 ps-8 pt-4 pb-0">
                <Link to="/income_statement">
                  <SheetClose>
                    <Text
                      variant={'heading2'}
                      style={'underline'}
                      className="flex gap-4 items-center"
                    >
                      <BookPlusIcon />
                      Income Statement
                    </Text>
                  </SheetClose>
                </Link>
                <Link to="/balance_sheet">
                  <SheetClose>
                    <Text
                      variant={'heading2'}
                      style={'underline'}
                      className="flex gap-4 items-center"
                    >
                      <BookPlusIcon />
                      Balance Sheet
                    </Text>
                  </SheetClose>
                </Link>
                <Link to="/cash_flow">
                  <SheetClose>
                    <Text
                      variant={'heading2'}
                      style={'underline'}
                      className="flex gap-4"
                    >
                      <BookMinusIcon />
                      Cash Flow
                    </Text>
                  </SheetClose>
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Link to="/transactions">
            <SheetClose>
              <Text
                variant={'heading1'}
                style={'underline'}
                className="flex gap-4"
              >
                <ArrowLeftRightIcon />
                Transactions
              </Text>
            </SheetClose>
          </Link>
          <Link to="/employees">
            <SheetClose>
              <Text
                variant={'heading1'}
                style={'underline'}
                className="flex gap-4 items-center"
              >
                <UsersRoundIcon />
                Employees
              </Text>
            </SheetClose>
          </Link>
          <Link to="/cheques">
            <SheetClose>
              <Text
                variant={'heading1'}
                style={'underline'}
                className="flex gap-4 items-center"
              >
                <ReceiptIcon />
                Cheques
              </Text>
            </SheetClose>
          </Link>
          <Link to="/payrolls">
            <SheetClose>
              <Text
                variant={'heading1'}
                style={'underline'}
                className="flex gap-4 items-center"
              >
                <HandCoinsIcon />
                Payrolls
              </Text>
            </SheetClose>
          </Link>
          <Link to="/inventoryEntries">
            <SheetClose>
              <Text
                variant={'heading1'}
                style={'underline'}
                className="flex gap-4 items-center"
              >
                <ArchiveIcon />
                Inventory Entries
              </Text>
            </SheetClose>
          </Link>
        </SheetContent>
      </Sheet>
    </header>
  )
}

export default Header
