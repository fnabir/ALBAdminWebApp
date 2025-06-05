import { addNewPaymentInfo } from "@/lib/functions";
import { PaymentInfoFormData, PaymentInfoFormSchema } from "@/lib/schemas";
import { getDatabaseReference } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useListKeys } from "react-firebase-hooks/database";
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
import { PaymentInfoOptions } from "@/lib/arrays";
import InputText from "@/components/generic/InputText";
import { ButtonLoading } from "@/components/generic/ButtonLoading";

export default function AddPaymentInfoDialog() {
  const [open, setOpen] = useState<boolean>(false);
  const [details, setDetails] = useState<boolean>(false);
  const [detailsLabel, setDetailsLabel] = useState<string>("Details");
  const projectNames = useListKeys(getDatabaseReference(`balance/project`))[0];
  const projectNameOptions = projectNames?.map((projectName) => ({ value: projectName}))

  const {
		register,
		setValue,
		getValues,
		watch,
		reset,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<PaymentInfoFormData>({
		resolver: zodResolver(PaymentInfoFormSchema),
	});

	const onSubmit = (data: PaymentInfoFormData) => {
		addNewPaymentInfo(data).finally(() => {
			setOpen(false);
			window.location.reload();
		})
	}

  const handleReset = () => {
    setDetails(false);
    setDetailsLabel("Details");
    reset();
  }

  const handleDialogOpenChange = (state: boolean) => {
    setOpen(state);
    handleReset();
  };

  const handleTypeChange = (paymentType: string) => {
    switch (paymentType) {
      case "account":
      case "cellAccount":
        setDetailsLabel("Account Number (last 8 digits only)");
        setValue("details", "");
        setDetails(true);
        break;
      case "bank":
      case "cheque":
        setDetailsLabel('Bank Name, Branch');
        setValue("details", "");
        setDetails(true);
        break;
      case "bKash":
      case "cell":
        setDetailsLabel('Phone Number');
        setValue("details", "");
        setDetails(true);
        break;
      case "cash":
        setDetails(false);
        setValue("details", getValues("project"))
        break;
      default:
        setDetailsLabel("Details");
        setValue("details", "");
        setDetails(true);
        break;
    }
  }

  return(
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant={"accent"}>
          <MdAddCircle/> Add New Payment Info
        </Button>
      </DialogTrigger>
      <DialogContent className={"border border-accent"}>
        <DialogHeader>
          <DialogTitle>Add New Payment Info</DialogTitle>
          <DialogDescription>
            Click submit to add the new payment info.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} onReset={handleReset}>
          <InputDropDown label="Project Name"
                        options={projectNameOptions ?? []}
                        {...register('project')}
                        error={errors.project?.message || ""}
                        required
          />
          {
            (watch("project") !== "Select" ||  watch("project") !== "") &&
            <InputDropDown label="Payment Info Type"
                          options={PaymentInfoOptions}
                          {...register('type')}
                          onChange={(e) => handleTypeChange(e.target.value)}
                          error={errors.type?.message || ""}
                          required
            />
          }
          {
            details && <InputText label={detailsLabel}
                    {...register("details")}
                    error={errors.details?.message || ""}
          />
          }
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