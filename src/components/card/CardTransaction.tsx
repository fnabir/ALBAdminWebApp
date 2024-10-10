import { GetObjectDataWithTotal } from "@/firebase/database";
import { formatCurrency } from "@/utils/functions";
import { useRouter } from "next/navigation";

export default function CardTransaction(props:TransactionInterface) {
    const router = useRouter();
    const detailsText = props.details;

    const {dataExist, data, dataLoading, total, error} =  GetObjectDataWithTotal(`transaction/${props.type}/${props.project}/${props.id}/data`);
    const bg = props.amount <= 0 || props.amount == total? 'bg-green-900' : props.amount > 0 ? props.amount < total ? 'bg-amber-900' : 'bg-red-900' : 'bg-slate-700';

    return (
        <button className={"rounded-lg shadow hidden md:block pb-1 sm:text-center md:text-start " + bg + " hover:bg-opacity-80"}>
            <div className="w-full mx-auto px-6 pt-1 md:flex md:items-center md:justify-between text-white">
                <div className="flex-wrap w-24">
                    {props.date}
                </div>
                <div className="flex-auto">
                    <div className="font-semibold">{detailsText == "" || detailsText == undefined? props.title : `${props.title} - ${detailsText}`}</div>
                </div>
                <div className="flex flex-wrap items-center mt-3 text-2xl font-medium sm:mt-0">
                    {formatCurrency(props.amount)}
                </div>
            </div>
            <div className={"border-0 bg-black rounded-md mx-6 bg-opacity-50"}>
                { data.sort((a, b) => b.key.localeCompare(a.key)).map((item) =>
                    (
                        <div className="w-full flex justify-between px-2 text-sm pt-1" key={item.key}>
                            <div className="flex-wrap w-24">{(item.details).substring(0, 8)}</div>
                            <div className="flex-auto">{(item.details).substring(8, )}</div>
                            <div className="flex flex-wrap">{formatCurrency(item.amount)}</div>
                        </div>
                    )
                  )}
            </div>
            
        </button>
    )
}