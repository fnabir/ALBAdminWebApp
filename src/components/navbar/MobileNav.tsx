import { MdDashboard, MdDomain, MdPerson , MdDirectionsBus, MdLogout, MdLink , MdFacebook  } from "react-icons/md"
import { AiFillCloseCircle } from "react-icons/ai"
import SideNavButton from "./SideNavButton";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { GetUserRole } from "@/firebase/database";

export default function MobileNav({setShowModal}: any) {
    const {user} = useAuth();
    const role = user ? GetUserRole(user.uid) : "";
    return (
        <div className='w-full h-[100vh] fixed top-0 right-0 md:hidden block bg-slate-900 z-50'>
            <nav className='w-full flex flex-col h-[100vh] p-4 space-y-8'>
                <div className="w-full flex items-center space-between">
                    <div className="w-full flex justify-between items-center">
                        <Image
                            className="w-3/5"
                            src="/ALBw.svg"
                            alt="Asian Lift Bangladesh"
                            width={200}
                            height={80}
                            priority={true}
                        />
                   
                        <div onClick={() => setShowModal(false)}>
                                <AiFillCloseCircle className="text-3xl cursor-pointer text-white"/>
                        </div>
                    </div>
                </div>
              
                <div className="divide-y w-full">
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