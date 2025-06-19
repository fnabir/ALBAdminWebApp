import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const transactionColorInfo = {
  expense: {
    1: {
      color: "green-900",
      details: "৳0 expense such as Free servicing, etc.",
    },
    2: {
      color: "red-900",
      details: "No payment record",
    },
    3: {
      color: "accent",
      details: "Payment record covering partial of the expense amount"
    },
    4: {
      color: "green-900",
      details: "Payment record covering the full expense amount"
    },
    5: {
      color: "yellow-900",
      details: "Payment record covering more than the expense amount"
    }
  },
  payment: {
    1: {
      color: "muted",
      details: "No expense record"
    },
    2: {
      color: "accent",
      details: "Expense record covering the partial amount of payment"
    },
    3: {
      color: "green-900",
      details: "Expense record covering the full amount of payment"
    },
    4: {
      color: "yellow-900",
      details: "Expense record covering more than the payment amount"
    },
  }
}

export default function TransactionColorInfoDialog() {
return (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant={"accent"} className="pr-2">Transaction Colour Info</Button>
    </DialogTrigger>
    <DialogContent className={"border border-accent"}>
      <DialogHeader>
        <DialogTitle>Transaction Colour Info</DialogTitle>
        <DialogDescription>
          Read to know what each coloured transaction means.
        </DialogDescription>
      </DialogHeader>
      {
        Object.entries(transactionColorInfo).map(([key, value]) => (
          <div key={key}>
            <div className="capitalize underline font-semibold">{`${key} Transaction`}</div>
            <div className="mt-2 space-y-2">
              {
                Object.entries(value).map(([id, { color, details }]) => (
                  <div key={id} className={`text-sm p-1 bg-${color} rounded-lg`}>{details}</div>
                ))
              }
            </div>
          </div>
        ))
      }
      <DialogFooter className={"sm:justify-center"}>
        <DialogClose asChild>
          <Button variant="destructive">
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)}