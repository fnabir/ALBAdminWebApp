import { formatCurrency } from "@/lib/utils";
import DeleteTransactionDialog from "@/components/transaction/DeleteTransactionDialog";

type Props = {
  type: string;
  id: string;
  transactionId: string;
  date: string;
  title: string;
  details?: string;
  value: number;
  isAdmin?: boolean;
}

export function TransactionRow({ type, id, transactionId, date, title, details, value, isAdmin=false}: Props) {
  return (
    <div className="group flex items-center justify-between p-1 rounded-lg hover:bg-secondary transition-all duration-200">
      <div className="w-full flex items-center gap-2 lg:gap-6">
        <div className="font-mono text-xs lg:text-[15px]">{date}</div>
        <div className="grow">
          <div className="font-medium">{title}</div>
          {details && (
            <p className="text-sm text-muted-foreground">{details}</p>
          )}
        </div>
        <span className="text-base lg:text-xl font-medium">{formatCurrency(value)}</span>
        {isAdmin && <DeleteTransactionDialog
          type={type}
          id={id}
          transactionId={transactionId}
        >
          <div className="group flex items-center justify-between bg-secondary p-2 my-4 rounded-lg transition-all duration-300">
            <div className="w-full flex items-center gap-2 lg:gap-6">
              <div className="font-mono text-xs lg:text-sm">{date}</div>
              <div className="grow font-medium">{title}</div>
              <span className="text-base lg:text-xl font-medium">{formatCurrency(value)}</span>
            </div>
          </div>
        </DeleteTransactionDialog>}
      </div>
    </div>
  )
}