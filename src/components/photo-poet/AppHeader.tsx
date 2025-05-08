
"use client";

import { Feather, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AppHeader() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  const getInitials = (email?: string | null) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  }

  return (
    <header className="w-full py-4 bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Feather className="h-8 w-8 mr-3 md:h-10 md:w-10" />
          <h1 className="text-3xl md:text-4xl font-serif font-bold">
            Photo Poet
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {isLoading ? (
             <div className="h-8 w-20 bg-primary/50 animate-pulse rounded-md"></div>
          ) : isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10">
                     {/* Add AvatarImage if you have user profile pictures */}
                    <AvatarFallback className="bg-accent text-accent-foreground font-semibold">
                      {getInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Signed In
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Add other items like Profile, Settings if needed */}
                {/* <DropdownMenuItem>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              {/* Optionally, show login/register buttons if not on those pages
              <Button asChild variant="secondary">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="outline" className="text-primary-foreground border-primary-foreground/50 hover:bg-primary-foreground/10">
                <Link href="/register">Register</Link>
              </Button>
              */}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
    