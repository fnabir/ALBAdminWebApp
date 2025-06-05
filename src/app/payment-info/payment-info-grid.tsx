import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { DataSnapshot } from "firebase/database";
import PaymentInfoRow from "./payment-info-row";

interface Props {
  data: DataSnapshot;
  animationDelay?: number;
  isAdmin: boolean;
}

export default function PaymentInfoGrid({ data, animationDelay=0, isAdmin=false }: Props) {
  return <Card className={`backdrop-blur-sm overflow-hidden bg-muted ${animationDelay != 0 ? "opacity-0 animate-fade-in-y" : ""}`}>
    <CardHeader className="text-lg text-center font-bold pt-2 pb-1 uppercase">
      {data.key === "bank" || data.key === "account" ? `${data.key!} transfer` : data.key === "cell" ? "cellfin" : data.key!}
    </CardHeader>
    <CardContent className={"space-y-1 text-sm"}>
      {
        Object.entries(data.val()).map(([key, value], index) => (
          <PaymentInfoRow
            type={data.key!}
            key={key}
            id={key}
            value={value!.toString()}
            isAdmin={isAdmin}
            animationDelay={animationDelay + 0.2 + index * 0.1}
          />
        ))
      }
    </CardContent>
  </Card>
};