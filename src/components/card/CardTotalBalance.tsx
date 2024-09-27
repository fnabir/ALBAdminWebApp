import { formatCurrency } from '@/utils/functions';
import { useRouter } from 'next/navigation';

type CardProps = {
    title: string;
    balance: number;
    date?: string;
    route?: string;
};

export default function CardBalance(props: CardProps) {
    const dateText = props.date == null || props.date == '' ? 'Last update date not found' : 'Last updated on ' + (props.date);
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
        <button className="w-full py-2 md:py-3 px-4 md:px-8 rounded-md bg-slate-800 hover:bg-slate-700" onClick={handleClick}>
            <h3 className="capitalize text-xl font-semibold">{props.title}</h3>
            <p className="text-3xl py-2">{formatCurrency(props.balance)}</p>
            <p className='text-sm'>{dateText}</p>
        </button>
    );
}