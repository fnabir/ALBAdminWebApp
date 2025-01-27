import React, {FC, useState} from "react";
import {MdDelete} from "react-icons/md";
import {Card} from "@/components/ui/card";
import {deletePaymentInfo} from "@/lib/functions";
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
import {Button} from "@/components/ui/button";

const CardPaymentInfo: FC<{type:string, id: string, value: string, userRole: string, className?: string, animationDelay?: number}> = ({
    type, id, value, userRole, className, animationDelay
}) => {
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const originalId = id.split("_")[0];

  const handleDelete = () => {
    deletePaymentInfo(type, id).finally(() => {
      setDeleteDialog(false);
      window.location.reload();
    });
  }

  return (
    <div className="flex space-x-2 opacity-0 animate-fade-in"
         style={{ animationDelay: `${animationDelay}s` }}>
      <Card className={`flex-auto flex items-center bg-card hover:text-card hover:bg-card-foreground hover:cursor-pointer rounded-lg py-1 px-2 transition-all duration-200 ${className}`}>
        <div className="flex-auto font-mono font-bold">{`${(type === "account" || (type === "cell" && originalId.length === 8)) ? "***": ""}${originalId}`}</div>
        <div>{(type !== "cash") && value}</div>
      </Card>
      {
        userRole === "admin" &&
        <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
          <DialogTrigger asChild>
            <Button size="icon"><MdDelete/></Button>
          </DialogTrigger>
          <DialogContent className={"border border-destructive"}>
            <DialogHeader>
              <DialogTitle>Delete Payment Info</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the payment info.
              </DialogDescription>
            </DialogHeader>
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
      }
    </div>
  )
}

export default CardPaymentInfo;