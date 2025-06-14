import { updateCallback } from "@/lib/functions";
import { CallbackFormData, CallbackFormSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { MdEditNote } from "react-icons/md";
import InputDropDown from "@/components/generic/InputDropdown";
import { CallbackStatusOptions } from "@/lib/arrays";
import InputText from "@/components/generic/InputText";
import { ButtonLoading } from "@/components/generic/ButtonLoading";
import { DataSnapshot } from "firebase/database";
import { CallbackInterface } from "@/lib/interfaces";
import { InputDate } from "@/components/generic/InputDate";
import { format, parse } from "date-fns";

type Props = {
  projectName: string;
  data: DataSnapshot;
};

export default function EditCallbackDialog({ projectName, data }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const val = data.val() as CallbackInterface;
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CallbackFormData>({
    resolver: zodResolver(CallbackFormSchema),
    defaultValues: {project: projectName}
  });

  const onSubmit = (formData: CallbackFormData) => {
    updateCallback(projectName, data.key!, {
      details: formData.details,
      name: formData.name,
      status: formData.status,
      date: format(new Date(formData.date), "dd.MM.yy"),
    }).finally(() => {
      setOpen(false);
    });
  };

  const handleDialogOpenChange = (state: boolean) => {
    setOpen(state);
    reset();
  };

  return(
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button size="icon"><MdEditNote/></Button>
      </DialogTrigger>
      <DialogContent className={"border border-accent"}>
        <DialogHeader>
          <DialogTitle>Add New Payment Info</DialogTitle>
          <DialogDescription>
            Click submit to add the new payment info.
          </DialogDescription>
        </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} onReset={() => reset}>
          <InputText label="Details"
                    defaultValue={val.details}
                    {...register("details")}
                    error={errors.details?.message || ""}
          />
          <InputText label="Name"
                    defaultValue={val.name}
                    {...register("name")}
                    error={errors.name?.message || ""}
          />
          <InputDropDown label="Status"
                        options={CallbackStatusOptions ?? []}
                        defaultValue={val.status}
                        {...register('status')}
                        error={errors.status?.message || ""}
          />
          <InputDate label="Date (Read-Only)"
                      defaultValue={format(parse(val.date, "dd.MM.yy", new Date()), "yyyy-MM-dd")}
                      {...register('date')}
                      error={errors.date?.message || ""}
                      readOnly
                      disabled
          />
					
          <DialogFooter className={"sm:justify-center pt-2 lg:pt-6"}>
            <DialogClose asChild>
              <Button variant="destructive">Close</Button>
            </DialogClose>
            <ButtonLoading
              type="submit"
              variant="accent"
              loading = {isSubmitting}
              text="Submit"
              loadingText="Submitting..."/>
            <Button type="reset" variant="secondary">Reset</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}