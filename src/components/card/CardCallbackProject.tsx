import React, {FC, useState} from "react";
import {MdDeleteOutline, MdEditNote} from "react-icons/md";
import CustomInput from "@/components/generic/CustomInput";
import CustomDropDown from "@/components/generic/CustomDropDown";
import {callbackStatusOptions} from "@/lib/arrays";
import CustomDateTimeInput from "../generic/CustomDateTimeInput";
import {format, parse} from "date-fns";
import {Badge} from "@/components/ui/badge";
import {Card} from "@/components/ui/card";
import {callback} from "@/lib/types";
import {deleteCallback, updateCallback} from "@/lib/functions";
import {useForm} from "react-hook-form";
import {CallbackFormData, callbackSchema} from "@/lib/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
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
import CustomSeparator from "@/components/generic/CustomSeparator";

const CardCallbackProject: FC<callback> = ({
    id, project, name, details, status, date
}) => {
  const [editDialog, setEditDialog] = useState<boolean>(false);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CallbackFormData>({
    resolver: zodResolver(callbackSchema),
    defaultValues: {project: project, details: details, name: name, status: status, date: format(parse(date, "dd.MM.yy", new Date()), "yyyy-MM-dd")},
  });

  const onSubmit = (data: CallbackFormData) => {
    updateCallback(project, id, {
      details: data.details,
      name: data.name,
      status: data.status,
      date: format(new Date(data.date), "dd.MM.yy"),
    }).finally(() => {
      setEditDialog(false);
      window.location.reload();
    });
  };

  const handleReset = () => {
    reset();
  };

  const handleDelete = () => {
    deleteCallback(project, id).finally(() => {
      setDeleteDialog(false);
      window.location.reload();
    });
  }

    return (
      <Card className={"flex w-full p-1 text-start bg-muted hover:bg-muted/80 items-center"}>
        <div className="w-full mx-auto px-4 py-1 flex items-center text-primary space-x-2">
          <div className="font-mono mr-2">
            {date}
          </div>
          <div className={`flex-auto font-semibold`}>{details}</div>
          <p className={`w-60 text-center`}>{name}</p>
          <div className="w-48 text-center">
            {status && status != "Select" ?
              <Badge className={`ml-2`}>{status}</Badge>
              : null
            }
          </div>
          <Dialog open={editDialog} onOpenChange={setEditDialog}>
            <DialogTrigger asChild>
              <button className={"flex size-7 justify-center items-center text-card bg-card-foreground rounded-lg"}>
                <MdEditNote className="size-5 text-center"/>
              </button>
            </DialogTrigger>
            <DialogContent className={"border border-accent"}>
              <DialogHeader>
                <DialogTitle>Edit Callback</DialogTitle>
                <DialogDescription>
                  Click update to save the changes in the callback record
                </DialogDescription>
              </DialogHeader>
              <CustomSeparator orientation={"horizontal"}/>
              <form onSubmit={handleSubmit(onSubmit)}>
                <CustomInput id="details"
                             type="text"
                             label={"Details"}
                             {...register('details')}
                             helperText={errors.details ? errors.details.message : ""}
                             color={errors.details ? "error" : "default"}
                             required
                />
                <CustomInput id="name"
                             type="text"
                             label={"Name"}
                             {...register('name')}
                             helperText={errors.name ? errors.name.message : ""}
                             color={errors.name ? "error" : "default"}
                             required
                />
                <CustomDropDown id="status"
                                label="Status"
                                options={callbackStatusOptions}
                                {...register('status')}
                                helperText={errors.status ? errors.status.message : ""}
                                color={errors.status ? "error" : "default"}
                                required
                />
                <CustomDateTimeInput id="date"
                                     type="date"
                                     label="Date"
                                     helperText={errors.date ? errors.date.message : ""}
                                     color={errors.date ? "error" : "default"}
                                     {...register("date")}
                                     required
                />
                <DialogFooter className={"sm:justify-center pt-6"}>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">Close</Button>
                  </DialogClose>
                  <Button type="button" variant="secondary" onClick={handleReset}>Reset</Button>
                  <Button type="submit" variant="accent">Update</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
            <DialogTrigger asChild>
              <button className={"flex size-7 justify-center items-center text-card bg-card-foreground rounded-lg"}>
                <MdDeleteOutline className="size-5 text-center"/>
              </button>
            </DialogTrigger>
            <DialogContent className={"border border-destructive"}>
              <DialogHeader>
                <DialogTitle>Delete Callback Record</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the callback record.
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
    )
}

export default CardCallbackProject;