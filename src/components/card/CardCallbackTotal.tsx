import { useRouter } from "next/navigation";
import {CallbackTotalInterface} from "@/lib/interfaces";
import {Card} from "@/components/ui/card";

export default function CardCallbackTotal(props:CallbackTotalInterface) {
    const router = useRouter();
    return (
        <Card className="flex w-full p-1 cursor-pointer bg-muted hover:bg-muted/80 items-center"
							onClick = {() => router.push(`/callback/${props.name}`)}>
            <div className="w-full px-6 flex items-center justify-between text-card-foreground">
							<div className="flex-auto font-semibold">{props.name}</div>
							<div className={"text-2xl font-medium"}>{props.value}</div>
            </div>
        </Card>
    )
}