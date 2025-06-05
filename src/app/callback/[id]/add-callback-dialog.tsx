import { addNewCallback } from "@/lib/functions";
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
import { MdAddCircle } from "react-icons/md";
import InputDropDown from "@/components/generic/InputDropdown";
import { CallbackStatusOptions } from "@/lib/arrays";
import InputText from "@/components/generic/InputText";
import { ButtonLoading } from "@/components/generic/ButtonLoading";
import { format } from "date-fns";
import { InputDate } from "@/components/generic/InputDate";
import { useListKeys } from "react-firebase-hooks/database";
import { getDatabaseReference } from "@/lib/utils";

type Props = {
  projectName?: string;
};

export default function AddCallbackDialog({ projectName }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const projectNames = useListKeys(getDatabaseReference(`balance/project`))[0];
	const projectNameOptions = projectNames?.map((name) => ({ value: name}))

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CallbackFormData>({
    resolver: zodResolver(CallbackFormSchema),
  });

  const onSubmit = (formData: CallbackFormData) => {
    addNewCallback(projectName ? projectName : formData.project, formData.date, {
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
        <Button variant={"accent"}>
          <MdAddCircle/> Add New Callback
        </Button>
      </DialogTrigger>
      <DialogContent className={"border border-accent"}>
        <DialogHeader>
          <DialogTitle>Add New Callback</DialogTitle>
          <DialogDescription>
            Click submit to add the new callback record
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} onReset={() => reset}>
          <InputDropDown label="Project Name"
                          options={projectNameOptions ? projectNameOptions : []}
                          defaultValue={projectName}
                          {...register('project')}
                          error={errors.project?.message || ""}
                          disabled={projectName ? true : false}
          />
          <InputText label="Details"
                    {...register("details")}
                    error={errors.details?.message || ""}
          />
          <InputText label="Name"
                    {...register("name")}
                    error={errors.name?.message || ""}
          />
          <InputDropDown label="Status"
                        options={CallbackStatusOptions ?? []}
                        {...register('status')}
                        error={errors.status?.message || ""}
          />
          <InputDate label="Date"
                        {...register('date')}
                        error={errors.date?.message || ""}
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