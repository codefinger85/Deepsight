import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Cog, LifeBuoy, Moon, LogOut } from 'lucide-react'; // Import icons

interface NavigationProps {
  hasActiveSession: boolean;
}

export default function Navigation({ hasActiveSession }: NavigationProps) {
  const pathname = usePathname();

  return (
    <div className="flex justify-between items-center self-stretch mx-8 pb-4 pt-4">

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="w-[32px] h-[32px] cursor-pointer transition-opacity hover:opacity-80">
            <AvatarImage src="/src/assets/Goldfinger profile.png" alt="@shadcn" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 mr-4" align="start">
          <DropdownMenuLabel className="font-semibold">John Doe</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
            <Cog className="w-4 h-4 text-slate-500" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
            <LifeBuoy className="w-4 h-4 text-slate-500" />
            <span>Support</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
            <Moon className="w-4 h-4 text-slate-500" />
            <span>Dark mode</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-500 focus:text-red-600">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center gap-3">
        <Link
          href="/trading"
          className={`font-medium text-xs text-slate-400 hover:text-slate-700 transition-colors duration-200  ${
            pathname === "/trading" ? "text-slate-700 underline" : ""
          }`}
        >
          Home
        </Link>
        <Link
          href="/trading/log"
          className={`font-medium text-xs text-slate-400 hover:text-slate-700 transition-colors duration-200 ${
            pathname === "/trading/log" ? "text-slate-700 underline" : ""
          }`}
        >
          Log
        </Link>
        
        </div>
      <Link
        href="/trading/end"
        className={`flex justify-center items-center px-3 py-1.5 rounded-lg font-medium text-xs leading-[20px] ${
          hasActiveSession
            ? "bg-slate-800 text-white hover:bg-slate-700"
            : "bg-slate-100 text-slate-400 pointer-events-none"
        }`}
      >
        End
      </Link>
      

    </div>
  );
}
