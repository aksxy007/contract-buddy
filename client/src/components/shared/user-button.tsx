import { useCurrentUser } from "@/hooks/use-currentuser";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link";
import { Icons } from "./icons";
import { logout } from "@/lib/api";
import { log } from "console";
import { useRouter } from "next/navigation";
import { useModalStore } from "@/store/zustand";



export function UserButton() {
  const { user } = useCurrentUser();
  const router = useRouter()
  const { openModal} = useModalStore();

  const handleLogout = async ()=>{
    const response = await logout();
    console.log(response)
    window.location.reload()
    setInterval(()=> router.push('/'),500)
  }

  return (
    <div className="w-full flex-1 md:w-auto md:flex-none space-x-2 hidden md:flex">
      {user ? (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className="size-8 rounded-full">
                        <Avatar className="size-10">
                            <AvatarImage src={user?.profilePicture || ""}/>
                            <AvatarFallback>
                                {user?.displayName?.charAt(0) || ""}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="flex flex-col items-start">
                <div className="text-sm font-medium">{user?.displayName}</div>
                <div className="text-sm text-muted-foreground">
                  {user?.email}
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={"/dashboard"}>
                  <Icons.dashboard className="mr-2 size-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={"/dashboard/settings"}>
                  <Icons.settings className="mr-2 size-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <Icons.logout className="mr-2 size-4" />
                <span>Logout</span>
              </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      ) : (
        <div className="w-full flex-1 md:w-auto md:flex-none space-x-2 hidden md:flex">
          <Button onClick={()=> openModal("connectAccountModal")}>Sign In</Button>
        </div>
      )}
    </div>
  );
}
