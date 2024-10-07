interface CardInterface {
    title: string
    details?: string
    detailsCenter?: boolean
}

export default function CardTitleDetails(props:CardInterface) {
    return (
        <div className={"w-full rounded-lg shadow md:block bg-slate-800 p-2 whitespace-break-spaces"}>
            <div className="font-semibold underline pb-1 text-center">{props.title}</div>
            <div className={(props.detailsCenter ? "text-center" : "")}>
                {props.details}
            </div>
        </div>
    )
}