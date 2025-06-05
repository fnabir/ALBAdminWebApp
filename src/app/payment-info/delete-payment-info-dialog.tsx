import { deletePaymentInfo } from "@/lib/functions";
import { useState } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MdDelete } from "react-icons/md";

type Props = {
  type: string;
  id: string;
  value: string;
};

export default function DeletePaymentInfoDialog({ type, id, value }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const handleDelete = () => {
    deletePaymentInfo(type, id).finally(() => {
      setOpen(false);
    });
  }

  return(
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" className="size-7 cursor-pointer"><MdDelete/></Button>
      </DialogTrigger>
      <DialogContent className={"border border-destructive"}>
        <DialogHeader>
          <DialogTitle>Delete Payment Info</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the payment info.
          </DialogDescription>
        </DialogHeader>
        <div className="text-center bg-muted rounded-xl border border-red-500">{`${(type === "account" || (type === "cell" && id.length === 8)) ? "***": ""}${id}: ${value}`}</div>
        <DialogFooter className={"mx-auto"}>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}