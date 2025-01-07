import React, {FC, useState} from 'react';
import {format} from "date-fns";
import {Badge} from "@/components/ui/badge";
import {MdDelete, MdEditNote} from "react-icons/md";
import {calendarEvent} from "@/lib/types";
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
import {deleteEvent} from "@/lib/functions";
import CustomSeparator from "@/components/generic/CustomSeparator";
import {useForm} from "react-hook-form";
import {EventFormData, eventSchema} from "@/lib/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import CustomInput from "@/components/generic/CustomInput";
import CustomCheckbox from "@/components/generic/CustomCheckBox";

const CardCalendarEvent: FC<calendarEvent> = ({
  id, title, details, assigned, start, end, allDay }) => {
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [allDayEvent, setAllDayEvent] = useState<boolean>(allDay);

  const handleDelete = () => {
    deleteEvent(id).finally(() => {
      setDeleteDialog(false);
      window.location.reload();
    });
  }

  const {
    register,
    reset,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: title,
      details: details,
      assigned: assigned,
      start: start,
      end: end,
      allDay: allDay
    },
  });

  const handleReset = () => {
    setAllDayEvent(allDay);
    reset();
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
                    className={"p-2 bg-black bg-opacity-40 rounded-lg hover:bg-opacity-70"}>
              <MdEditNote color={"white"} size={24}/>
            </button>
          </DialogTrigger>
          <DialogContent className={"border border-blue-500"}>
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription>
                Click update to save the changes.
              </DialogDescription>
            </DialogHeader>
            <CustomSeparator orientation={"horizontal"} className={"mb-2"}/>
            <form>
              <CustomInput id="title"
                           type="text"
                           label={"Title"}
                           {...register('title')}
                           helperText={errors.title ? errors.title.message : ""}
                           color={errors.title ? "error" : "default"}
              />
              <CustomInput id="details"
                           type="text"
                           label={"Details"}
                           {...register('details')}
                           helperText={errors.details ? errors.details.message : ""}
                           color={errors.details ? "error" : "default"}
              />
              <CustomCheckbox id="allDay"
                              label="All day"
                              {...register("allDay")}
                              onChange={(e) => setAllDayEvent(e.target.checked)}
              />
              <CustomInput id="start"
                           type="datetime-local"
                           label={"Start"}
                           {...register('start')}
                           helperText={errors.start ? errors.start.message : ""}
                           color={errors.start ? "error" : "default"}
              />
              {
                !allDayEvent && <CustomInput id="end"
                                            type="datetime-local"
                                            label={"End"}
                                            {...register('end')}
                                            helperText={errors.end ? errors.end.message : ""}
                                            color={errors.end ? "error" : "default"}
                />
              }
              <DialogFooter className={"sm:justify-center pt-8"}>
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
            <button className={"p-2 bg-black bg-opacity-40 rounded-lg hover:bg-opacity-70"}>
              <MdDelete color={"white"} size={24}/>
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

export default CardCalendarEvent;