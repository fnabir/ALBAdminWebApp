"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  FaBook,
  FaBuilding,
  FaBuildingUser,
  FaBusSimple,
  FaCalendarDay,
  FaGlobe,
  FaLinkedin,
  FaMicrosoft, FaMoneyBillTransfer,
  FaSquareFacebook,
  FaTag,
  FaUser,
  FaWrench
} from "react-icons/fa6";
import Image from "next/image";
import Logo from "@/images/logo-text.svg"
import {useAuth} from "@/hooks/useAuth";
import {NavMain} from "@/components/sidebar/nav-main"
import {NavLinks} from "@/components/sidebar/nav-links";
import {NavUser} from "@/components/sidebar/nav-user"

const navData = {
  dashboard: [
    {
      label: "Dashboard",
      href: "/",
      icon: FaMicrosoft,
    },
  ],
  main: [
    {
      label: "Project",
      href: "/project",
      icon: FaBuilding,
    },
    {
      label: "Staff",
      href: "/staff",
      icon: FaUser,
      isAdmin: true,
    },
    {
      label: "Conveyance",
      href: "/conveyance",
      icon: FaBusSimple,
      isAdmin: true,
    },
  ],
  projects: [
    {
      label: "Callback",
      href: "/callback",
      icon: FaWrench,
    },
    {
      label: "Offer",
      href: "/offer",
      icon: FaTag,
    },
    {
      label: "Info",
      href: "/project-info",
      icon: FaBuildingUser,
    },
    {
      label: "Payment",
      href: "/payment-info",
      icon: FaMoneyBillTransfer,
    },
  ],
  utility: [
    {
      label: "Error Code",
      href: "/error-code",
      icon: FaBook,
    },
    {
      label: "Calendar",
      href: "/calendar",
      icon: FaCalendarDay,
    },
  ],
  links: [
    {
      label: "Website",
      href: "https://asianliftbd.com",
      icon: FaGlobe,
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/asianliftbangladesh",
      icon: FaSquareFacebook,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/asian-lift-bangladesh",
      icon: FaLinkedin,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {user, isAdmin} = useAuth();
  let userData: { name: string, email: string } = {
    name: "", email: "",
  };
  if (user) {
    userData = {
      name: user.displayName ? user.displayName : "",
      email: user.email!,
    }
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div>
                <div className="flex aspect-square size-36">
                  <Image
                    priority
                    src={Logo}
                    alt="Asian Lift Bangladesh"
                  />
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.dashboard} />
        <NavMain items={navData.main} isAdmin={isAdmin}/>
        {isAdmin && <NavMain label={'Projects'} items={navData.projects} isAdmin={isAdmin}/>}
        {isAdmin && <NavMain label={'Utilities'} items={navData.utility} isAdmin={isAdmin}/>}
        <NavLinks items={navData.links}/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}