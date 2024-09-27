import { formatCurrency } from "@/utils/functions";
import { useRouter } from "next/navigation";

export default function CardTransaction(props:TransactionInterface) {
    const router = useRouter();
    const detailsText = props.details;
    const bg = props.amount == 0 ? 'bg-green-900' : props.amount < 0 ? 'bg-yellow-900' : 'bg-slate-700';

    return (
        <button className={"rounded-lg shadow hidden md:block sm:text-center md:text-start " + bg + " hover:bg-opacity-80"}>
            <div className="w-full mx-auto px-6 pt-1 md:flex md:items-center md:justify-between text-white">
                <div className="flex-wrap">
                    {props.date}
                </div>
                <div className="flex-auto ml-3">
                    <div className="font-semibold">{props.title}</div>
                    <p id="updatedate" className={"text-xs pb-1 " + detailsText == "" ? "hidden" : ""}>{detailsText}</p>
                </div>
                <div className="flex flex-wrap items-center mt-3 text-2xl font-medium sm:mt-0">
                    {formatCurrency(props.amount)}
                </div>
            </div>
            
        </button>
    )
}