import { formatCurrency } from "@/utils/functions";
import { useRouter } from "next/navigation";
import { Badge } from "flowbite-react";

export default function CardBalance(props:BalanceInterface) {
    const router = useRouter();
    const dateText = props.date;
    const bg = props.status && props.status == 'cancel' ? 'bg-red-900' : props.value == 0 ? 'bg-green-900' : props.value < 0 ? 'bg-yellow-900' : 'bg-slate-700';

    const handleClick = async (e: any) => {
        e.preventDefault();
        try {
            router.push(`/${props.type}/${props.id}`);
        } catch (error: any) {
            console.log(error);
        }
	  };

    return (
        <button className={"rounded-lg shadow hidden md:block sm:text-center md:text-start " + bg + " hover:bg-opacity-80"} onClick = {handleClick}>
            <div className="w-full mx-auto px-6 pt-1 md:flex md:items-center md:justify-between text-white">
                <div>
									  <div className={"flex items-center space-x-2"}>
                        <div className="font-semibold">{props.name} </div>
                        <Badge color={props.status == 'cancel' ? "failure" : props.value < 0 ? "warning" : ""}>{props.status == 'cancel' ? "Cancelled" : props.value < 0 ? "Overpaid" : ""}</Badge>
                    </div>
                    <p id="updatedate" className={"text-xs pb-1 " + dateText == "" ? "hidden" : ""}>{dateText}</p>
                </div>
                <div className={"flex flex-wrap items-center text-2xl font-medium sm:mt-0"}>
                    {formatCurrency(props.value)}
                </div>
            </div>
        </button>
    )
}