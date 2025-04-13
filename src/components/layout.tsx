import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { FC, ReactNode } from "react";
import {ThemeToggle} from "@/components/header/themeToggle";
import {breadcrumbItem} from "@/lib/types";

const Layout: FC<{ breadcrumb: breadcrumbItem[], children: ReactNode }> = ({
    breadcrumb, children
  }) => {
    return(
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className={"flex flex-col h-screen"}>
            <header
              className="flex px-4 py-2 h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <SidebarTrigger className="-ml-1"/>
              <Separator orientation="vertical" className="mr-2 h-5"/>
              <Breadcrumb className={"flex-auto"}>
                <BreadcrumbList>
                  {breadcrumb.map((crumb, index) => (
                    index != breadcrumb.length - 1 ?
                      crumb.text != "/" ?
                        <BreadcrumbItem key={index}>
                          <BreadcrumbLink href={crumb.link}>{crumb.text}</BreadcrumbLink>
                        </BreadcrumbItem>
                        :
                        <BreadcrumbSeparator key={index}/>
                    :
                      <BreadcrumbItem key={index}>
                        <BreadcrumbPage>{crumb.text}</BreadcrumbPage>
                      </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
              <ThemeToggle/>
            </header>
            <div className="flex-1 gap-4 px-4 overflow-y-auto">
              {children}
            </div>
            <footer
              className={`flex text-center shrink-0 items-center md:justify-between gap-2 mx-4 my-2 transition-[width,height] ease-linear p-4 rounded-xl bg-muted/100 text-sm text-primary`}>
              <span className="flex-1 text-center md:text-left">
                © 2024 <a href="https://asianliftbd.com/" className="hover:underline">Asian Lift Bangladesh</a>. All Rights Reserved.
              </span>
                <ul className="flex space-x-4">
                  <li>
                    <a
                      className="hover:underline"
                      href="https://asianliftbd.com/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:underline"
                      href="https://asianliftbd.com/terms-of-use"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Terms Of Use
                    </a>
                  </li>
                </ul>
            </footer>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
}

export default Layout;
