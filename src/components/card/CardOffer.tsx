export default function CardOffer(props:Offer) {
    const line1 = props.address ?  `${props.name} - ${props.address}` : `${props.name}`;
    const line2 = props.wtype + " - " + (props.ptype ? props.ptype + (props.unit ? `(${props.unit})` : "") : "");
    const line3 = (props.floor ? `Floor/Stop: ${props.floor} | ` : "") + (props.person ? `Person/Load: ${props.person} | ` : "") + (props.shaft ? `Shaft Dimension: ${props.shaft} ` : "");
    const line4 = (props.note ? `${props.note} | ` : "") + (props.refer ? `${props.refer}` : "");


    return (
        <button className={"rounded-lg shadow hidden md:block sm:text-center md:text-start bg-slate-700 hover:bg-opacity-80"}>
            <div className="w-full mx-auto px-6 pt-1 md:flex md:items-center md:justify-between text-white">
                    <div className="flex-wrap w-28">
                        {props.date}
                    </div>
                    <div className="flex-auto">
                        <div className="font-semibold">{line1}</div>
                        <div>{line2}</div>
                        <div>{line3}</div>
                        <div>{line4}</div>
                    </div>
            </div>
            
        </button>
    )
}