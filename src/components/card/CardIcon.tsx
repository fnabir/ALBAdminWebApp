import { useRouter } from 'next/navigation';
import { FC, ReactNode } from 'react';

type CardProps = {
    title: String;
    number?: number;
    subtitle?: String;
    route?: string;
};

const CardIcon: FC<CardProps & { children: ReactNode }> = ({
    title,
    number,
    subtitle,
    route,
    children
  }) => {
    const router = useRouter();
    
    const handleClick = async (e: any) => {
        e.preventDefault();
		try {
            route ? router.push(`/${route}`) : null;
		} catch (error: any) {
			console.log(error.message);
		}
	};

    return(
        <button className="w-full h-auto py-2 md:py-3 px-4 md:px-8 rounded-md bg-slate-800 hover:bg-slate-700 inline-flex space-x-2" onClick={handleClick}>
            {children}
            <div>
                <h3 className="text-xl capitalize font-bold">{number && number > 0 ? title + ' (' + number + ')' : title}</h3>
                {subtitle ? <p className='text-sm text-left'>{subtitle}</p> : null}
            </div>
        </button>
    );
  };

export default CardIcon; 