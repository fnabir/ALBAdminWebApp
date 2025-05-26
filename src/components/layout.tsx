import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { FC, ReactNode, useEffect, useState } from "react";
import {ThemeToggle} from "@/components/header/themeToggle";
import { BreadcrumbInterface } from "@/lib/interfaces";
import BreadcrumbSection from "@/components/header/breadcrumbSection";
import Loading from "@/components/loading";

const Layout: FC<{ breadcrumb: BreadcrumbInterface[], children: ReactNode }> = ({breadcrumb, children}) => {
  const [showLoader, setShowLoader] = useState(true);
  
  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setShowLoader(false), 600);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  return(
    <>
      {showLoader && <Loading />}
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className={"flex flex-col h-screen pb-2"}>
            <header
              className="flex px-4 py-2 h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <SidebarTrigger className="-ml-1"/>
              <Separator orientation="vertical" className="mr-2 h-5"/>
              <BreadcrumbSection breadcrumb={breadcrumb}/>
              <ThemeToggle/>
            </header>
            <div className="flex-1 px-2 md:px-4 overflow-y-auto">
              {children}
            </div>
            <footer className="hidden md:flex shrink-0 items-center md:justify-between space-x-4 mx-4 my-2 p-4 rounded-xl bg-muted text-sm">
              <span>
                © {new Date().getFullYear()} <a href="https://asianliftbd.com/" className="hover:underline">Asian Lift Bangladesh</a>. All Rights Reserved.
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
    </>
  )
}

export default Layout;
