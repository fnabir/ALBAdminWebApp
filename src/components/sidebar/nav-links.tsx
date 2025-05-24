import {
  SidebarGroup, SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SidebarItemInterface } from "@/lib/interfaces";

export function NavLinks({
  items
}: {
  items: SidebarItemInterface[],
  access?: string,
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Links</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton asChild tooltip={item.label}>
              <a
                href={item.href}
                target={"_blank"}
                rel="noopener noreferrer"
              >
                {item.icon && <item.icon/>}
                <span>{item.label}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}