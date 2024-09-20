import { formatCurrency } from "@/utils/functions";
import { useRouter } from "next/navigation"

export default function TotalBalance(props:TotalBalanceInterface) {
    const router = useRouter();
    const titleText = props.text ? props.text : "Total Balance";
    const dateText = props.date == null || props.date == '' ? 'Last update date not found' : 'Last updated on ' + (props.date);

    return (
        <div className="rounded-lg shadow bg-slate-800 hidden md:block">
            <div className="w-full mx-auto px-6 pt-2 md:flex md:items-center md:justify-between text-white">
                <div>
                    <div className="text-xl  sm:text-center md:text-start">{titleText}</div>
                    <p id="updatedate" className="text-sm pb-2 sm:text-center md:text-start">{dateText}</p>
                </div>
                <text className="flex flex-wrap items-center mt-3 text-3xl font-medium sm:mt-0">
                    {formatCurrency(props.value)}
                </text>
            </div>
            
        </div>
    )
}