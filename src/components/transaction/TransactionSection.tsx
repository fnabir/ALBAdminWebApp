import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ReactNode } from "react";

interface Props {
  title: string;
  balance?: number;
  backdropColor?: string;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
}

const TransactionSection: React.FC<Props> = ({title, balance=0, backdropColor, children, className, contentClassName}) => {
  return <Card className={`backdrop-blur-sm overflow-hidden ${className}`}>
    {backdropColor && <div className={`-z-1 absolute -top-5 -right-5 size-30 rounded-full opacity-40 blur-2xl ${backdropColor}`}/>}
    <CardHeader className="flex items-center border-b-2 border-white/30 px-2 lg:px-6 py-1.5 lg:py-3">
        <CardTitle className="text-xl lg:text-2xl font-bold w-full flex items-center justify-between">
            <div>{title}</div>
            {balance !== 0 && <div>{formatCurrency(balance)}</div>}
        </CardTitle>
    </CardHeader>
    <CardContent className={`${contentClassName}`}>
      <div className="h-2 w-full"/>
      {children}
    </CardContent>
  </Card>
}

export default TransactionSection;