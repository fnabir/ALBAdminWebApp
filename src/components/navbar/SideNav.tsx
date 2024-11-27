import {
    MdDashboard,
    MdDomain,
    MdPerson,
    MdDirectionsBus,
    MdLogout,
    MdLink,
    MdFacebook,
    MdCalendarMonth, MdLocalOffer
} from "react-icons/md"
import Image from "next/image";
import SideNavButton from "@/components/navbar/SideNavButton";
import { useAuth } from "@/context/AuthContext";
import {HiWrenchScrewdriver} from "react-icons/hi2";

export default function SideNav() {
    const {user} = useAuth();
    if (!user) return <></>;
    else {
        const role = user.role;
        return (
            <div className='md:w-[25%] lg:w-[12%] md:block hidden'>
                <nav className='md:w-[25%] lg:w-[12%] fixed flex flex-col left-0 h-[100vh] bg-slate-900 p-4 space-y-4'>
                    <Image
                        className="w-full"
                        src="/ALBw.svg"
                        alt="Asian Lift Bangladesh"
                        width={200}
                        height={80}
                        priority={true}
                    />

                    <div className="divide-y">
                        <div className='flex-col'>
                            <SideNavButton text={'Dashboard'} route={'/'}>
                                <MdDashboard className='mx-2 w-6 h-6'/>
                            </SideNavButton>
                        </div>

                        <div className={role == "admin" || role == "manager" ? 'flex-col' : 'hidden'}>
                            <SideNavButton text='Projects' route='project' show={role == "admin" || role == "manager"}>
                                <MdDomain className='mx-2 w-6 h-6'/>
                            </SideNavButton>
                            <SideNavButton text='Staff' route='staff' show={role == "admin"}>
                                <MdPerson className='mx-2 w-6 h-6'/>
                            </SideNavButton>
                            <SideNavButton text='Conveyance' route='conveyance' show={role == "admin"}>
                                <MdDirectionsBus className='mx-2 w-6 h-6'/>
                            </SideNavButton>
                        </div>

                        <div className={role == "admin" || role == "manager" ? 'flex-col' : 'hidden'}>
                            <SideNavButton text='Callback' route='callback'>
                                <HiWrenchScrewdriver className='mx-2 w-6 h-6'/>
                            </SideNavButton>
                            <SideNavButton text='Offer' route='offer'>
                                <MdLocalOffer className='mx-2 w-6 h-6'/>
                            </SideNavButton>
                            <SideNavButton text='Calendar' route='calendar'>
                                <MdCalendarMonth className='mx-2 w-6 h-6'/>
                            </SideNavButton>
                        </div>

                        <div className='flex-col'>
                            <SideNavButton text='Website' link='https://asianliftbd.com'>
                                <MdLink className='mx-2 w-6 h-6'/>
                            </SideNavButton>
                            <SideNavButton text='Facebook' link='https://www.facebook.com/asianliftbangladesh'>
                                <MdFacebook className='mx-2 w-6 h-6'/>
                            </SideNavButton>
                        </div>

                        <div className='flex-col'>
                            <SideNavButton text={'Logout'} route={'logout'}>
                                <MdLogout className='mx-2 w-6 h-6'/>
                            </SideNavButton>
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
}