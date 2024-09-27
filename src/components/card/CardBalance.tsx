import { formatCurrency } from "@/utils/functions";
import { useRouter } from "next/navigation";

export default function CardBalance(props:BalanceInterface) {
    const router = useRouter();
    const dateText = props.date;
    const bg = props.status && props.status == 'cancel' ? 'bg-red-900' : props.value == 0 ? 'bg-green-900' : props.value < 0 ? 'bg-yellow-900' : 'bg-slate-700';

    const handleClick = async (e: any) => {
        e.preventDefault();
		try {
            router.push(`/project/${props.name}`);
		} catch (error: any) {
			console.log(error.message);
		}
	};

    return (
        <button className={"rounded-lg shadow hidden md:block sm:text-center md:text-start " + bg + " hover:bg-opacity-80"} onClick = {handleClick}>
            <div className="w-full mx-auto px-6 pt-1 md:flex md:items-center md:justify-between text-white">
                <div>
                    <div className="font-semibold">{props.name}</div>
                    <p id="updatedate" className={"text-xs pb-1 " + dateText == "" ? "hidden" : ""}>{dateText}</p>
                </div>
                <div className="flex flex-wrap items-center mt-3 text-2xl font-medium sm:mt-0">
                    {formatCurrency(props.value)}
                </div>
            </div>
            
        </button>
    )
}