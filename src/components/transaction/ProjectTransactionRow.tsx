import {formatCurrency, getDatabaseReference, getTotalValue} from "@/lib/utils";
import React from "react";
import {useList, useListKeys} from "react-firebase-hooks/database";
import { OptionsInterface, ProjectTransactionInterface } from "@/lib/interfaces";
import DeleteTransactionDialog from "./DeleteTransactionDialog";
import EditProjectTransactionDialog from "@/components/transaction/EditProjectTransactionDialog";

interface Props {
    projectName: string;
    transactionId: string;
    transactionData: ProjectTransactionInterface;
    isAdmin: boolean;
    paidDataOptions?:OptionsInterface[]|null;
    servicingCharge: number;
}

export function ProjectTransactionRow({ projectName, transactionId, transactionData, isAdmin=false, paidDataOptions, servicingCharge}: Props) {
  const val = transactionData;
  const databaseRef = `transaction/project/${projectName}/${transactionId}`;
  const [data] = useList(getDatabaseReference(`${databaseRef}/data`));
  const [dataKeys] = useListKeys(getDatabaseReference(`${databaseRef}/data`));
  const total: number = getTotalValue(data, "amount");
  const bg: string = val.amount == 0 ? 'bg-green-800 hover:bg-green-900' :
                    val.amount < 0 ? total + val.amount == 0 ? 'bg-green-800 hover:bg-green-900' : total == 0 ? `bg-muted` : total > val.amount ? 'bg-yellow-800 hover:bg-yellow-900' : 'bg-accent' :
                    total == 0 ? 'bg-red-800 hover:bg-red-900' : val.amount == total ? 'bg-green-800 hover:bg-green-900' : total > val.amount ? 'bg-yellow-800 hover:bg-yellow-900' : `bg-accent`;

  return (
    <div className={`group flex space-x-2 items-center justify-between px-1.5 lg:px-3 py-0.5 lg:py-1 rounded-xl text-accent-foreground ${bg} transition-all duration-200`}>
      <div className="flex-col w-full items-center">
        <div className="w-full mx-auto flex items-center justify-between text-sm md:text-base gap-2 md:gap-6">
          <div className="font-mono">{val.date}</div>
          <div className="flex-1">
            <div className="font-semibold">
              {val.title}
              {val.details && <span className={"font-medium"}> - {val.details}</span> }
            </div>
          </div>
          <div className="items-center md:text-lg font-mono font-medium sm:mt-0">
            {formatCurrency(val.amount)}
          </div>
        </div>
        <div className={"border-0 bg-black rounded-md bg-opacity-50"}>
          {
            data && data.sort((a, b) => b.key!.localeCompare(a.key!)).map((item) => {
              const snapshot = item.val();
              return (
                <div className="w-full flex space-x-2 md:space-x-6 px-2 text-xs md:text-sm pt-1" key={item.key}>
                  <div className="font-mono">{(snapshot.details).substring(0, 8)}</div>
                  <div className="flex-1">{(snapshot.details).substring(8,)}</div>
                  <div className={"font-mono"}>{formatCurrency(snapshot.amount)}</div>
                </div>
              )
            })
          }      
        </div>
      </div>
      {isAdmin && <EditProjectTransactionDialog projectName={projectName} 
                                                transactionId={transactionId}
                                                formVal={transactionData}
                                                databaseRef={databaseRef}
                                                servicingCharge={servicingCharge}
                                                data={data}
                                                dataKeys={dataKeys}
                                                paidDataOptions={paidDataOptions}
                                                total={total}/>}
          {
            isAdmin && <DeleteTransactionDialog type="project" id={projectName} transactionId={transactionId} dataKeys={dataKeys}>
              <div className="flex w-full space-x-2 border border-blue-500 p-1 rounded-xl">
                <div>{val.date}</div>
                <div className="grow">{`${val.title} ${val.details ? `- ${val.details}` : ""}`}</div>
                <div>{formatCurrency(val.amount)}</div>
              </div>
            </DeleteTransactionDialog>
          }
    </div>
  )
};