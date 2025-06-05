import React, {} from "react";
import {Card} from "@/components/ui/card";
import DeletePaymentInfoDialog from "./delete-payment-info-dialog";

type Props = {
  type: string;
  id: string;
  value: string;
  isAdmin: boolean;
  className?: string;
  animationDelay?: number;
};

export default function PaymentInfoRow({ type, id, value, isAdmin, className, animationDelay }: Props) {
  const originalId = id.split("_")[0];

  return (
    <div className="flex space-x-2 opacity-0 animate-fade-in-y"
         style={{ animationDelay: `${animationDelay}s` }}>
      <Card className={`flex-auto flex items-center bg-card hover:text-card hover:bg-card-foreground hover:cursor-pointer rounded-lg py-1 px-2 transition-all duration-200 ${className}`}>
        <div className="flex-auto font-mono font-bold">{`${(type === "account" || (type === "cell" && originalId.length === 8)) ? "***": ""}${originalId}`}</div>
        <div>{(type !== "cash") && value}</div>
      </Card>
      {
        isAdmin && <DeletePaymentInfoDialog type={type} id={originalId} value={value} />
        
      }
    </div>
  )
};