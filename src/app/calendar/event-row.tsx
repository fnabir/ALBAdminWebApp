import React, {FC, useState} from 'react';
import {format} from "date-fns";
import {Badge} from "@/components/ui/badge";
import {MdDelete, MdEditNote} from "react-icons/md";
import {Card} from "@/components/ui/card";
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
import {deleteEvent, updateEvent} from "@/lib/functions";
import {useForm} from "react-hook-form";
import {EventFormData, EventFormSchema} from "@/lib/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import { CalendarEventInterface } from '@/lib/interfaces';
import InputText from '@/components/generic/InputText';
import { Separator } from '@/components/ui/separator';

const EventRow: FC<CalendarEventInterface> = ({
  id, title, details, assigned, start, end, allDay }) => {
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: {
      title: title,
      details: details,
      assigned: assigned,
      allDay: allDay,
      start: start,
      end: end,
    },
  });

  const handleReset = () => {
    reset();
  }

  const onSubmit = (data: EventFormData) => {
    updateEvent(id, {
      title: data.title,
      details: data.details,
      assigned: data.assigned,
    }).finally(() => {
      setEditDialog(false);
      window.location.reload();
    });
  }

  const handleDelete = () => {
    deleteEvent(id).finally(() => {
      setDeleteDialog(false);
      window.location.reload();
    });
  }

  return(
    <Card className={`flex w-full p-1 text-start bg-muted hover:bg-muted/80 items-center space-x-2 text-card-foreground`}>
      <div className="flex-col -space-y-1 items-center border border-card-foreground rounded-lg p-1">
        <div className={"text-xl"}>{format(new Date(start), "dd")}</div>
        <div className={"text-xs"}>{format(new Date(start), "MMM")}</div>
      </div>

      <div className={`flex-1`}>
        <div className="capitalize font-semibold">{title}</div>
        {details && <p className='text'>{details}</p>}
        {assigned && <p className='text-sm'>{assigned}</p>}
        <Badge className={`w-fit`}>{!allDay && end ? `${format(new Date(start), "HH:mm aa")}-${format(new Date(end), "HH:mm aa")}` : "All Day"}</Badge>
      </div>

      <div className={`flex space-x-1`}>
        <Dialog open={editDialog} onOpenChange={setEditDialog}>
          <DialogTrigger asChild>
            <button onClick={handleReset}
                    className={"p-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-accent hover:text-accent-foreground"}>
              <MdEditNote size={24}/>
            </button>
          </DialogTrigger>
          <DialogContent className={"border border-blue-500"}>
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription>
                Click update to save the changes.
              </DialogDescription>
            </DialogHeader>
            <Separator orientation={"horizontal"} className={"mb-2"}/>
            <form onSubmit={handleSubmit(onSubmit)}>
              <InputText label={"Title"}
                        {...register('title')}
                          error={errors.title?.message || ""}
              />
              <InputText label={"Details"}
                        {...register('details')}
                        error={errors.details?.message || ""}
              />
              <InputText label={"Assigned"}
                        {...register('assigned')}
                        error={errors.assigned?.message || ""}
              />
              <DialogFooter className={"sm:justify-center pt-4"}>
                <DialogClose asChild>
                  <Button type="button" size="lg" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
                <Button type="button" size="lg" variant="secondary" onClick={handleReset}>Reset</Button>
                <Button type="submit" size="lg" variant="accent">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
          <DialogTrigger asChild>
            <button className={"p-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-accent hover:text-accent-foreground"}>
              <MdDelete size={24}/>
            </button>
          </DialogTrigger>
          <DialogContent className={"border border-destructive"}>
            <DialogHeader>
              <DialogTitle>Delete Transaction</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the transaction.
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
      </div>
    </Card>
  );
};

export default EventRow;