import SideNav from "@/components/navbar/SideNav";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

interface LayoutProps {
    pageTitle: string,
    headerTitle: string,
    children?: React.ReactNode
}

export default function Layout(props: LayoutProps) {
    const { user } = useAuth();
    return(
        <main className="flex min-h-screen w-full relative">
            <title>{props.pageTitle}</title>
            <SideNav/>
            <div className="w-full md:w-[75%] lg:w-[85%] py-2 px-2 bg-gray-950 flex flex-col">
                <Header title={props.headerTitle} username={user.username} email={user.email}/>
                {props.children}
                <Footer/>
            </div>
                
        </main>
    )
}