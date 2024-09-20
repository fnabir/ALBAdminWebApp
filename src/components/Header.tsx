import { ImExit } from "react-icons/im"
import { useRouter } from "next/navigation"
import { useState } from "react"
import MobileNav from "./navbar/MobileNav"
import { MdMenu, MdMenuOpen } from "react-icons/md"
import { FaCircleUser } from "react-icons/fa6";

interface Props {
    title: string
    username: string
    email: string
}

export default function Header(props: Props) {
    const router = useRouter()
    const [showModal, setShowModal] = useState(false)

    const handleClick = async (e: any) => {
        e.preventDefault();
		try {
            router.push(`/update-profile`);
		} catch (error: any) {
			console.log(error.message);
		}
	};

    return (
     <header className='flex items-center justify-between py-2 px-6 bg-slate-800 border-transparent rounded-md'>
            <h2 className='text-2xl font-semibold cursor-default select-none'>{props.title}</h2>
            <button className='flex space-x-3' onClick={handleClick}>
                <div className="flex-col text-right hidden md:block">
                    <p className='text-white'>{props.username}</p>
                    <p className="text-sm text-slate-300">{props.email}</p>
                </div>
                <FaCircleUser className='text-5xl text-white md:block hidden cursor-pointer' />
                <div className="bg-white p-2 cursor-pointer md:hidden block rounded" onClick={()=> setShowModal(true)}>
                    <MdMenu className='text-3xl text-slate-900'/>
                </div>   
            </button>
            {showModal && (
                <div>
                    <MobileNav setShowModal={setShowModal} />
                </div>
                    )}
        </header>

    )
}