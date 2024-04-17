import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Text } from "./ui/text";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArchiveIcon,
  ArrowLeftRightIcon,
  BookMinusIcon,
  BookPlusIcon,
  BookTextIcon,
  ClipboardListIcon,
  HandCoinsIcon,
  HomeIcon,
  LogOutIcon,
  MoonIcon,
  ReceiptIcon,
  SettingsIcon,
  UsersRoundIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useTheme } from "./ui/theme.provider";
import { Switch } from "./ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

function Header() {
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["CurrentUser"] });
      navigate({ to: "/login" });
    },
  });

  const handleLogout = () => {
    logout.mutate();
  };
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
              variant={"heading2bold"}
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
                      <AvatarImage src="https://github.com/nestortion.png" />
                      <AvatarFallback>NG</AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  <DropdownMenuLabel>
                    <div className="flex gap-4 items-center">
                      <Avatar>
                        <AvatarImage src="https://github.com/nestortion.png" />
                        <AvatarFallback>NG</AvatarFallback>
                      </Avatar>
                      <div>Nestor P. Gerona</div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex gap-4 hover:cursor-pointer">
                    <div>
                      <SettingsIcon />
                    </div>
                    <div>Settings</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex gap-4 hover:cursor-pointer">
                    <div>
                      <MoonIcon />
                    </div>
                    <div>
                      <Switch
                        checked={theme === "dark" ? true : false}
                        onCheckedChange={(w) => {
                          w ? setTheme("dark") : setTheme("light");
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

        <SheetContent side={"left"} className="flex flex-col justify-center">
          <Link to="/">
            <SheetClose>
              <Text
                variant={"heading1"}
                style={"underline"}
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
                  variant={"heading1"}
                  style={"underline"}
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
                      variant={"heading2"}
                      style={"underline"}
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
                      variant={"heading2"}
                      style={"underline"}
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
                      variant={"heading2"}
                      style={"underline"}
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
                variant={"heading1"}
                style={"underline"}
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
                variant={"heading1"}
                style={"underline"}
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
                variant={"heading1"}
                style={"underline"}
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
                variant={"heading1"}
                style={"underline"}
                className="flex gap-4 items-center"
              >
                <HandCoinsIcon />
                Payrolls
              </Text>
            </SheetClose>
          </Link>
          <Link to="/inventory">
            <SheetClose>
              <Text
                variant={"heading1"}
                style={"underline"}
                className="flex gap-4 items-center"
              >
                <ArchiveIcon />
                Inventory
              </Text>
            </SheetClose>
          </Link>
          <Link to="/reports">
            <SheetClose>
              <Text
                variant={"heading1"}
                style={"underline"}
                className="flex gap-4 items-center"
              >
                <ClipboardListIcon />
                Reports
              </Text>
            </SheetClose>
          </Link>
        </SheetContent>
      </Sheet>
    </header>
  );
}

export default Header;
