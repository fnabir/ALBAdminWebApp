import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {Card, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {BalanceInterface} from "@/lib/interfaces";

export default function CardBalance(props:BalanceInterface) {
    return (
      <Link
        href={`/${props.type}/${props.id}`}>
          <Card
            className={`flex w-full justify-between items-center px-6 py-2 hover:bg-opacity-75
                        ${props.status === "cancel" ? "bg-red-900 text-white" : 
                          props.value < 0 ? "bg-yellow-900 text-white" : 
                          props.value === 0 ? "bg-green-900 text-white" : "bg-muted hover:bg-muted/80 text-primary" }`}
            >
            <div className={"items-center"}>
              <CardHeader className={"flex-row items-center space-x-2 space-y-0 p-0"}>
                <CardTitle className="font-semibold">{props.name}</CardTitle>
                {
                  (props.status === "cancel" || props.value < 0) &&
                  <Badge>{props.status == 'cancel' ? "Cancelled" : props.value < 0 ? "Overpaid" : ""}</Badge>
                }
              </CardHeader>
              { props.date && <CardFooter className="text-sm p-0">{props.date}</CardFooter>}
            </div>
            <div className={"flex items-center text-2xl font-medium font-mono"}>
                {formatCurrency(props.value)}
            </div>
          </Card>
        </Link>
    )
}