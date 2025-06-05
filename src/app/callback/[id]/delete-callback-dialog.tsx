import { deleteCallback } from "@/lib/functions";
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
import { MdDelete } from "react-icons/md";
import { Button } from "@/components/ui/button";

type Props = {
  id: string;
  projectName: string;
  info: string;
};

export default function DeleteCallbackDialog({ id, projectName, info }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const handleDelete = () => {
    deleteCallback(projectName, id).finally(() => {
      setOpen(false);
    });
  }

  return(
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon"><MdDelete/></Button>
      </DialogTrigger>
      <DialogContent className={"border border-destructive"}>
        <DialogHeader>
          <DialogTitle>Delete Offer</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the offer.
          </DialogDescription>
        </DialogHeader>
        <div className="text-center bg-muted p-1 border border-red-500 rounded-lg">{info}</div>
        <DialogFooter className={"mx-auto"}>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Close</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}