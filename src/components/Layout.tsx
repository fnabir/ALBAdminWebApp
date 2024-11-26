import SideNav from "@/components/navbar/SideNav";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FC, ReactNode } from "react";

interface LayoutProps {
    pageTitle: string,
    headerTitle: string
}

const Layout: FC<LayoutProps & { children: ReactNode }> = ({
    pageTitle,
    headerTitle,
    children
  }) => {
    return(
        <main className="flex min-h-screen w-full relative">
            <title>{pageTitle}</title>
            <SideNav/>
            <div className="w-full md:w-[75%] lg:w-[85%] py-2 px-2 bg-gray-950 flex flex-col">
                <Header title={headerTitle}/>
                <div className="h-full">{children}</div>
                <Footer/>
            </div>
                
        </main>
    )
}

export default Layout;