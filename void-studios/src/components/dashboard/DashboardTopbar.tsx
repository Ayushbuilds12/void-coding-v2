"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/AuthProvider";
import { toast } from "@/components/ui/sonner";

export function DashboardTopbar({
  name,
  email,
  photoURL,
  planName,
}: {
  name: string;
  email: string;
  photoURL?: string;
  planName: string;
}) {
  const { logout } = useAuth();
  const router = useRouter();

  const initials = name
    ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "VS";

  const onLogout = async () => {
    await logout();
    toast.success("Signed out");
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-end gap-4 border-b border-border glass px-6 pl-16 md:pl-6">
      <Badge variant={planName === "Free" ? "secondary" : "default"} className="hidden sm:inline-flex">
        {planName} plan
      </Badge>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none">
          <Avatar className="h-9 w-9 border border-border">
            {photoURL && <AvatarImage src={photoURL} alt={name} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="truncate">{name}</span>
              <span className="truncate text-xs font-normal text-muted-foreground">{email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
            <UserIcon className="h-4 w-4" /> Account settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onLogout} className="text-primary">
            <LogOut className="h-4 w-4" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
