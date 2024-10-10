import { useRouter } from 'next/navigation';
import { logout } from '@/firebase/auth';
import { FC, ReactNode } from 'react';

type SideNavButtonProps = {
    text: String;
    icon?: String;
    route?: String;
    link?: string;
};

const SideNavButton: FC<SideNavButtonProps & { children: ReactNode }> = ({
    text,
    icon,
    route,
    link,
    children
  }) => {

    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            console.log('Logged out successfully')
        } catch (error: any) {
            console.log(error.message);
        }
    };

    const handleClick = async (e: any) => {
        e.preventDefault();
		try {
            route ? route == 'logout' ? handleLogout() : router.push(`/${route}`) : null;
            link ? window.open(link) : null;
		} catch (error: any) {
			console.log(error.message);
		}
	};

    return (
        <button className="w-full flex h-12 items-center rounded-lg my-3 p-2 bg-slate-800 hover:bg-slate-700"
        onClick = {handleClick}>
            {children}
            <h2 className='pl-2'>{text}</h2>
        </button>
    );
};

export default SideNavButton;