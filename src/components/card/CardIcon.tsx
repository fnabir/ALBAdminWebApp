import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

type CardProps = {
    icon: ReactNode
    title: String;
    number?: number;
    subtitle?: String;
    route?: string;
};

export default function CardIcon(props: CardProps) {

    const router = useRouter();

    const handleClick = async (e: any) => {
        e.preventDefault();
		try {
            props.route ? router.push(`/${props.route}`) : null;
		} catch (error: any) {
			console.log(error.message);
		}
	};

    return(
        <button className="w-full h-auto py-2 md:py-3 px-4 md:px-8 rounded-md bg-slate-800 hover:bg-slate-700 inline-flex space-x-2" onClick={handleClick}>
            {props.icon}
            <div>
                <h3 className="text-xl capitalize font-bold">{props.number && props.number > 0 ? props.title + ' (' + props.number + ')' : props.title}</h3>
                {props.subtitle ? <p className='text-sm text-left'>{props.subtitle}</p> : null}
            </div>
        </button>
    );
}