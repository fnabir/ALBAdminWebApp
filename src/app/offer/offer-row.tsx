import React from "react";
import {Card} from "@/components/ui/card";
import DeleteOfferDialog from "./delete-offer-dialog";
import EditOfferDialog from "./edit-offer-dialog";
import { DataSnapshot } from "firebase/database";

type Props = {
  data: DataSnapshot;
  isAdmin: boolean;
};

export default function OfferRow({data, isAdmin=false} : Props) {
  const val = data.val();
  const line1 = `${val.name} ${val.address ? `- ${val.address}` : ""}`;
  const line2 = `${val.work} - ${val.product ? `${val.product} ${val.unit ? `(${val.unit})` : ""}` : ""}`;
  const line3 = `${val.floor ? `Floor/Stop: ${val.floor} | ` : ""} ${val.person ? `Person/Load: ${val.person} | ` : ""} ${val.shaft ? `Shaft Dimension: ${val.shaft}` : ""}`;
  
  return (
    <Card className="flex w-full px-2 lg:px-4 text-start bg-muted hover:bg-muted/80 items-center space-x-2">
      <div className="w-28">{val.date}</div>
      <div className="flex-auto">
        <div className="font-semibold">{line1}</div>
        <div>{line2}</div>
        <div>{line3}</div>
        <pre className="font-sans">{val.note}</pre>
        <div>{val.refer}</div>
      </div>
      <EditOfferDialog data={data} />
      {isAdmin && <DeleteOfferDialog id={data.key!} info={line1}/>}
    </Card>
  )
};