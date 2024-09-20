import { MdDashboard, MdDomain, MdPerson , MdDirectionsBus, MdLogout, MdLink , MdFacebook  } from "react-icons/md"
import { useRouter } from "next/navigation";
import Image from "next/image";
import SideNavButton from "@/components/navbar/SideNavButton";

export default function SideNav() { 
     const router = useRouter()
    return (
        <div className='md:w-[25%] lg:w-[15%] md:block hidden'>
            <nav className='md:w-[25%] lg:w-[15%] fixed flex flex-col left-0 h-[100vh] bg-slate-900 p-4 space-y-8'>

                <Image
                    className="w-4/5"
                    src="ALBw.svg"
                    alt="Asian Lift Bangladesh"
                    width={200}
                    height={80}
                    priority={true}
                />

                <div className="divide-y">
                    <div className='flex-col'>
                        <SideNavButton
                            children = {<MdDashboard className='mx-2 w-6 h-6'/>}
                            text = {'Dashboard'}
                            route={'/'}
                        />
                    </div>

                    <div className='flex-col'>
                        <SideNavButton
                            children = {<MdDomain className='mx-2 w-6 h-6'/>}
                            text = 'Projects'
                            route = 'projects'/>
                        <SideNavButton 
                            children={<MdPerson className='mx-2 w-6 h-6'/>}
                            text = 'Staff'
                            route = 'staff'/>
                        <SideNavButton
                            children = {<MdDirectionsBus className='mx-2 w-6 h-6'/>}
                            text = 'Conveyance'
                            route = 'conveyance'/>
                    </div>

                    <div className='flex-col'>
                        <SideNavButton 
                            children = {<MdLink className='mx-2 w-6 h-6'/>}
                            text = 'Website'
                            link ='https://asianliftbd.com'/>
                        <SideNavButton 
                            children = {<MdFacebook className='mx-2 w-6 h-6'/>}
                            text = 'Facebook'
                            link = 'https://www.facebook.com/asianliftbangladesh'/>
                    </div>

                    <div className='flex-col'>
                        <SideNavButton
                            children = {<MdLogout className='mx-2 w-6 h-6'/>}
                            text = {'Logout'}
                            route={'logout'}
                            />
                    </div>
                </div>
            </nav>
        </div>
    )
}