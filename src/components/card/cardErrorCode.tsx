import { Card } from "@/components/ui/card"

interface Props {
	title: string
	details?: string
	detailsCenter?: boolean
}

export default function CardErrorCode(props:Props) {
	return (
		<Card className={"w-full bg-muted hover:bg-muted/65 p-2 whitespace-break-spaces"}>
			<div className="font-semibold underline pb-1 text-center">{props.title}</div>
			<div className={(props.detailsCenter ? "text-center" : "")}>
				{props.details}
			</div>
		</Card>
	)
}