import { formatCurrency } from "@/utils/functions";

export default function ProjectBalance(props:ProjectBalanceInterface) {
    const dateText = props.date == null || props.date == '' ? 'Last update date not found' : 'Last updated on ' + (props.date);
    const bg = props.status && props.status == 'cancel' ? 'bg-red-900' : props.value == 0 ? 'bg-green-900' : props.value < 0 ? 'bg-yellow-900' : 'bg-slate-700';
    const bgHover = props.status && props.status == 'cancel' ? 'bg-red-950' : props.value == 0 ? 'bg-green-950' : props.value < 0 ? 'bg-yellow-950' : 'bg-slate-800';

    return (
        <div className={"rounded-lg shadow hidden md:block " + bg + " hover:" + bgHover}>
            <div className="w-full mx-auto px-6 pt-1 md:flex md:items-center md:justify-between text-white">
                <div>
                    <div className="sm:text-center md:text-start font-semibold">{props.name}</div>
                    <p id="updatedate" className="text-xs pb-1 sm:text-center md:text-start">{dateText}</p>
                </div>
                <text className="flex flex-wrap items-center mt-3 text-2xl font-medium sm:mt-0">
                    {formatCurrency(props.value)}
                </text>
            </div>
            
        </div>
    )
}