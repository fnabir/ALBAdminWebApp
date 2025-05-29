import {
  SidebarGroup, SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SidebarItemInterface } from "@/lib/interfaces";
import Link from "@/components/link";
export function NavMain({
  items, isAdmin, label
}: {
  items: SidebarItemInterface[],
  access?: string,
  isAdmin?: boolean,
  label?: string
}) {
  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => (
          (item.isAdmin ? item.isAdmin === isAdmin : true) && <SidebarMenuItem key={item.label}>
            <SidebarMenuButton asChild tooltip={item.label}>
              <Link href={item.href}>
                {item.icon && <item.icon/>}
                {item.label}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}