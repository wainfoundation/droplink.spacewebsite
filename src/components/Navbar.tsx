import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import NavLogo from "@/components/navbar/NavLogo";
import DesktopNavigation from "@/components/navbar/DesktopNavigation";
import MobileNavigation from "@/components/navbar/MobileNavigation";
import UserMenu from "@/components/navbar/UserMenu";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <span className="font-bold text-xl mr-4 text-sky-500">Droplink</span>
          <DesktopNavigation />
        </div>
        <div className="flex items-center gap-4">
          <MobileNavigation />
          <UserMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
