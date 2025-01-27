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
      title: "Dashboard",
      url: "/",
      icon: FaMicrosoft,
    },
  ],
  main: [
    {
      title: "Project",
      url: "/project",
      icon: FaBuilding,
    },
    {
      title: "Staff",
      url: "/staff",
      icon: FaUser,
      access: "admin",
    },
    {
      title: "Conveyance",
      url: "/conveyance",
      icon: FaBusSimple,
      access: "admin",
    },
  ],
  projects: [
    {
      title: "Callback",
      url: "/callback",
      icon: FaWrench,
    },
    {
      title: "Offer",
      url: "/offer",
      icon: FaTag,
    },
    {
      title: "Info",
      url: "/project-info",
      icon: FaBuildingUser,
    },
    {
      title: "Payment",
      url: "/payment-info",
      icon: FaMoneyBillTransfer,
    },
  ],
  utility: [
    {
      title: "Error Code",
      url: "/error-code",
      icon: FaBook,
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: FaCalendarDay,
    },
  ],
  links: [
    {
      title: "Website",
      url: "https://asianliftbd.com",
      icon: FaGlobe,
    },
    {
      title: "Facebook",
      url: "https://www.facebook.com/asianliftbangladesh",
      icon: FaSquareFacebook,
    },
    {
      title: "LinkedIn",
      url: "https://www.linkedin.com/company/asian-lift-bangladesh",
      icon: FaLinkedin,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {user, userRole} = useAuth();
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
        <NavMain items={navData.main} userAccess={userRole}/>
        <NavMain label={'Projects'} items={navData.projects} userAccess={userRole}/>
        <NavMain label={'Utilities'} items={navData.utility} userAccess={userRole}/>
        <NavLinks items={navData.links}/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}