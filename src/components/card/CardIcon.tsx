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
        <button className="w-full h-auto py-2 md:py-3 px-4 md:px-8 rounded-md bg-slate-800 hover:bg-slate-700 flex space-x-2 text-left items-center" onClick={handleClick}>
            {children}
            <div>
                <h3 className="text-xl capitalize font-bold">{title}</h3>
                {subtitle ? <p className='text-sm'>{subtitle}</p> : null}
            </div>
            <div className={((number && number > 0) ? " " : "hidden") + " bg-slate-500 text-md font-semibold leading-8 w-8 h-8 rounded-full text-center"}>{number}</div>
        </button>
    );
  };

export default CardIcon; 