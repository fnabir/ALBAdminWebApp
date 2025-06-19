import { formatCurrency } from "@/lib/utils";
import Link from "@/components/link";
import {Badge} from "@/components/ui/badge";
import {Card, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {BalanceInterface} from "@/lib/interfaces";

interface CardBalanceProps extends BalanceInterface {
  animationDelay?: number;
}

export default function CardBalance({
  id, name, value, date, type, status, animationDelay = 0}: CardBalanceProps) {
    const getCardStyle = () => {
      if (status === "cancel") return "bg-red-900 text-white hover:bg-red-900/80";
      if (value < 0) return "bg-yellow-900 text-white hover:bg-yellow-900/80";
      if (value === 0) return "bg-green-900 text-white hover:bg-green-900/80";
      return "bg-muted text-primary hover:bg-muted/80";
    };

    const badgeLabel = status === "cancel" ? "Cancelled" : value < 0 ? "Overpaid" : null;
    
    return (
      <Link href={`/${type}/${id}`} className={animationDelay !== 0 ? "opacity-0 animate-fade-in-x" : ""}
						style={{animationDelay: `${animationDelay}s`}}>
        <Card className={`flex w-full justify-between items-center px-2 lg:px-6 py-2 ${getCardStyle()} transition-all duration-150`}>
          <div className={"grow items-center justify-start"}>
            <CardHeader className={"flex flex-col md:flex-row items-center space-x-0 md:space-x-2 space-y-1 md:space-y-0 p-0 w-fit"}>
              <CardTitle className="text-sm md:text-base font-semibold">{name}</CardTitle>
              {badgeLabel && <Badge>{badgeLabel}</Badge>}
            </CardHeader>
            { date && <CardFooter className="text-sm p-0">{date}</CardFooter>}
          </div>
          <div className={"flex-wrap items-center text-xl md:text-2xl font-medium font-mono"}>
              {formatCurrency(value)}
          </div>
        </Card>
      </Link>
    )
}