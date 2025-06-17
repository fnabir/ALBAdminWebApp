import React, { forwardRef } from "react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { DataSnapshot } from "firebase/database";

interface Props {
  projectName: string;
  transactionData?: DataSnapshot[];
  total: number;
}

const ProjectTransactionPrint = forwardRef<HTMLDivElement, Props>(({ projectName, transactionData, total }, ref) => {
  return (
    <div
      ref={ref}
      className="-z-50 absolute inset-0 h-full overflow-hidden print:overflow-auto print:flex flex-col bg-[url('/images/letterpad.jpg')] bg-cover bg-no-repeat px-[0.5in] pt-[1.6in] pb-[0.65in]"
    >
      <div className="pb-2 text-lg">
        Project Name: <span className="font-bold">{projectName}</span>
      </div>
      <Separator className="h-[2px]" />
      <div className="flex space-x-4 font-semibold py-0.5 bg-black/10 px-2">
        <div className="w-20">Date</div>
        <div className="grow text-start">Details</div>
        <div>Amount (৳)</div>
      </div>
      <Separator className="h-[2px]" />
      <div className="grow divide-y divide-primary/80">
        {transactionData?.map((transaction, index) => {
          const val = transaction.val();
          return (
            <div key={transaction.key} className="flex space-x-4 py-0.25 items-center px-2">
              <div className="w-20">{val.date}</div>
              <div className="grow">{`${val.title}${val.details ? ` - ${val.details}` : ""}`}</div>
              <div>{formatCurrency(val.amount, 0, "")}</div>
              {index > 0 && index % 27 === 0 && (
                <div className="break-before-page" />
              )}
            </div>
          );
        })}
      </div>
      <Separator className="h-[2px]" />
      <div className="flex py-1 px-2 font-bold text-[17px]">
        <div className="grow">Total Balance</div>
        <div>{formatCurrency(total)}</div>
      </div>
      <Separator className="h-[2px]" />
      <div className="text-center mt-2">
        <div>Generated on: {format(new Date(), "dd.MM.yyyy")}</div>
        <div>
          This statement has been generated from database of Asian Lift Bangladesh upon available data. Hence no signature
          required.
        </div>
      </div>
    </div>
  );
});

ProjectTransactionPrint.displayName = "ProjectTransactionPrint";
export default ProjectTransactionPrint;