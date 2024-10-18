import { MdDashboard, MdDomain, MdPerson , MdDirectionsBus, MdLogout, MdLink , MdFacebook  } from "react-icons/md"
import Image from "next/image";
import SideNavButton from "@/components/navbar/SideNavButton";
import { GetUserRole } from "@/firebase/database";
import { useAuth } from "@/context/AuthContext";

export default function SideNav() {
    const {user} = useAuth();
    const role = user ? GetUserRole(user.uid) : "";
    return (
        <div className='md:w-[25%] lg:w-[15%] md:block hidden'>
            <nav className='md:w-[25%] lg:w-[15%] fixed flex flex-col left-0 h-[100vh] bg-slate-900 p-4 space-y-8'>

                <Image
                    className="w-4/5"
                    src="/ALBw.svg"
                    alt="Asian Lift Bangladesh"
                    width={200}
                    height={80}
                    priority={true}
                />

                <div className="divide-y">
                    <div className='flex-col'>
                        <SideNavButton text = {'Dashboard'} route={'/'}>
                            <MdDashboard className='mx-2 w-6 h-6'/>
                        </SideNavButton>
                    </div>

                    <div className={role == "admin" || role == "manager" ? 'flex-col' : 'hidden'}>
                        <SideNavButton text = 'Projects' route = 'project' show={role == "admin" || role == "manager"}>
                            <MdDomain className='mx-2 w-6 h-6'/>
                        </SideNavButton>
                        <SideNavButton text = 'Staff' route = 'staff' show={role == "admin"}>
                            <MdPerson className='mx-2 w-6 h-6'/>
                        </SideNavButton>
                        <SideNavButton text = 'Conveyance' route = 'conveyance' show={role == "admin"}>
                            <MdDirectionsBus className='mx-2 w-6 h-6'/>
                        </SideNavButton>
                    </div>

                    <div className='flex-col'>
                        <SideNavButton text = 'Website' link ='https://asianliftbd.com'>
                            <MdLink className='mx-2 w-6 h-6'/>
                        </SideNavButton>
                        <SideNavButton text = 'Facebook' link = 'https://www.facebook.com/asianliftbangladesh'>
                            <MdFacebook className='mx-2 w-6 h-6'/>
                        </SideNavButton>
                    </div>

                    <div className='flex-col'>
                        <SideNavButton text = {'Logout'} route={'logout'}>
                            <MdLogout className='mx-2 w-6 h-6'/>
                        </SideNavButton>
                    </div>
                </div>
            </nav>
        </div>
    )
}