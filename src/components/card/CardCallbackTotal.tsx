import { useRouter } from "next/navigation";

export default function CardCallbackTotal(props:CallbackTotalInterface) {
    const router = useRouter();

    const handleClick = async (e: any) => {
        e.preventDefault();
		try {
            router.push(`/callback/${props.name}`);
		} catch (error: any) {
            console.log(error);
		}
	};

    return (
        <button className={"rounded-lg shadow hidden md:block sm:text-center md:text-start bg-slate-700 hover:bg-opacity-80"} onClick = {handleClick}>
            <div className="w-full mx-auto px-6 pt-1 md:flex md:items-center md:justify-between text-white">
                <div>
                    <div className="font-semibold">{props.name}</div>
                </div>
                <div className={"flex flex-wrap items-center text-2xl font-medium sm:mt-0"}>
                    {props.value}
                </div>
            </div>
            
        </button>
    )
}