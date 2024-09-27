import { useRouter } from 'next/navigation';
import { logout } from '@/firebase/auth';

type SideNavButtonProps = {
    text: String;
    icon?: String;
    route?: String;
    link?: string;
    children?: React.ReactNode
};

const SideNavButton = (props: SideNavButtonProps) => {

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
            props.route ? props.route == 'logout' ? handleLogout() : router.push(`/${props.route}`) : null;
            props.link ? window.open(props.link) : null;
		} catch (error: any) {
			console.log(error.message);
		}
	};

    return (
        <button className="w-full flex h-12 items-center rounded-lg my-3 p-2 bg-slate-800 hover:bg-slate-700"
        onClick = {handleClick}>
            {props.children}
            <h2 className='pl-2'>{props.text}</h2>
        </button>
    );
};

export default SideNavButton;