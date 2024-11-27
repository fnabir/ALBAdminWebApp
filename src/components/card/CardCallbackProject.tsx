export default function CardCallbackProject(props:CallbackProjectInterface) {
    const name = props.name ?  ` - ${props.name}` : "";

    return (
        <button className={"rounded-lg shadow hidden md:block sm:text-center md:text-start bg-slate-700 hover:bg-opacity-80"}>
            <div className="w-full mx-auto px-4 py-1 flex items-center justify-between text-white">
                    <div className="flex-wrap w-20">
                        {props.date}
                    </div>
                    <div className="flex-auto">
                      <div className={`font-semibold`}>{props.details}</div>
                      <p className={`text-sm`}>{props.name}</p>
                    </div>
            </div>
        </button>
    )
}