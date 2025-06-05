import React, {} from "react";
import {Badge} from "@/components/ui/badge";
import {Card} from "@/components/ui/card";
import { DataSnapshot } from "firebase/database";
import { CallbackInterface } from "@/lib/interfaces";
import EditCallbackDialog from "./edit-callback-dialog";
import DeleteCallbackDialog from "./delete-callback-dialog";

type Props = {
  projectName: string;
  data: DataSnapshot;
  isAdmin: boolean;
};

export default function CallbackRow({projectName, data, isAdmin=false} : Props) {
  const val = data.val() as CallbackInterface;

  return (
    <Card className={"flex flex-col lg:flex-row w-full px-4 py-1 text-start bg-muted hover:bg-muted/80 items-center space-x-2"}>
        <div className="font-mono pr-4">{val.date}
        </div>
        <div className="flex-auto font-semibold">
          <div>{val.details}</div>
          {
            val.status && val.status != "Select" ?
            <Badge className={`ml-2`}>{val.status}</Badge>
            : null
          }
        </div>
        <div className="pr-4">{val.name}</div>
        <div className="flex space-x-2">
          <EditCallbackDialog projectName={projectName} data={data}/>
          {isAdmin && <DeleteCallbackDialog projectName={projectName} id={data.key!} info={`${val.date} - ${val.details}`}/>}
        </div>
    </Card>
  )
};