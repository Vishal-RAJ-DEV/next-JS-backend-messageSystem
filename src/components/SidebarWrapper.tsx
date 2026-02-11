"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconMessageCircle,
  IconHome,
  IconArrowLeft,
  IconArrowRight,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  // Don't show sidebar on auth pages
  const isAuthPage = pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/verify");

  if (isAuthPage) {
    return <>{children}</>;
  }

  // Base links available to all users
  const baseLinks = [
    {
      label: "Home",
      href: "/",
      icon: (
        <IconHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
  ];

  // Login link for unauthenticated users
  const loginLink = {
    label: "Sign In",
    href: "/sign-in",
    icon: (
      <IconArrowRight className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
    ),
  };

  // Protected links only available to authenticated users
  const protectedLinks = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
    {
      label: "Messages",
      href: "/messages",
      icon: (
        <IconMessageCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/profile",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
  ];

  // Logout link for authenticated users
  const logoutLink: any = {
    label: "Logout",
    href: "#",
    icon: (
      <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
    ),
    onClick: () => signOut({ callbackUrl: "/sign-in" }),
  };

  // Combine links based on authentication status
  const links: any[] = session && session.user
    ? [...baseLinks, ...protectedLinks, logoutLink]
    : [...baseLinks, loginLink];

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "min-h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  onClick={link.onClick}
                />
              ))}
            </div>
          </div>
          {/* ✅ Fix: Move SidebarUserInfo to bottom of SidebarBody */}
          {session && session.user && <SidebarUserInfo />}
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 overflow-hidden">
        <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        MessageApp
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

// ✅ Fix: Improved user info component with proper collapsed state
export const SidebarUserInfo = () => {
  const { data: session } = useSession();
  const { open, animate } = useSidebar();
  const user = session?.user;

  if (!user) return null;

  return (
    <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
      <div className="flex items-center gap-3  py-3">
        {/* ✅ Fix: User Avatar - Always visible, centered when collapsed */}
        <div className={cn(
          "rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold shrink-0 transition-all duration-200",
          open ? "w-10 h-10" : "w-8 h-8 mx-auto" // ✅ Smaller and centered when collapsed
        )}>
          <span className={cn(
            open ? "text-sm" : "text-xs" // ✅ Smaller text when collapsed
          )}>
            {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* ✅ Fix: User Info - Only show when expanded */}
        <motion.div
          animate={{
            display: animate ? (open ? "block" : "none") : "block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className="flex-1 min-w-0"
        >
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
            {user.username || "User"}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
            {user.email}
          </p>
        </motion.div>
      </div>
    </div>
  );
};