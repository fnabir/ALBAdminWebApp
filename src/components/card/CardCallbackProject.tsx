import { useRouter } from "next/navigation";

export default function CardCallbackProject(props:CallbackProjectInterface) {
    const router = useRouter();
    const name = props.name ?  ` - ${props.name}` : "";

    return (
        <button className={"rounded-lg shadow hidden md:block sm:text-center md:text-start bg-slate-700 hover:bg-opacity-80"}>
            <div className="w-full mx-auto px-6 pt-1 md:flex md:items-center md:justify-between text-white">
                    <div className="flex-wrap w-24">
                        {props.date}
                    </div>
                    <div className="font-semibold flex-auto">{`${props.details}${name}`}</div>
            </div>
            
        </button>
    )
}