import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MdAddCircle } from "react-icons/md";
import { Button } from "@/components/ui/button";
import InputText from "@/components/generic/InputText";
import InputDropDown from "@/components/generic/InputDropdown";
import { ButtonLoading } from "@/components/generic/ButtonLoading";
import { TransactionFormData, TransactionFormSchema } from "@/lib/schemas";
import { addNewTransaction, updateLastUpdateDate } from "@/lib/functions";
import { StaffTransactionTypeOptions } from "@/lib/arrays";
import { format } from "date-fns";
import { showToast } from "@/lib/utils";
import { InputDate } from "@/components/generic/InputDate";

type Props = {
  staffID: string;
};

export default function AddStaffTransactionDialog({ staffID }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [sign, setSign] = useState<string>("+");

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(TransactionFormSchema),
  });

  const handleDialogChange = (state: boolean) => {
    setOpen(state);
    reset();
  };

  const handleTitleChange = (value: string) => {
		switch (value) {
			case "Advance":
			case "For Conveyance":
			case "House Rent":
			case "Payment":
			case "Others":
				setSign("-");
				setValue("details", "");
				break;
			case "Salary":
			case "Bonus":
			case "Cashback":
				setSign("+");
				setValue("details", "");
				break;
			default:
				setSign("-");
				setValue("details", "");
				break;
		}
	};

  const onSubmit = async (data: TransactionFormData) => {
    console.log(errors)
    addNewTransaction("staff", staffID	, data.date, {
      title: data.title,
      details: data.details,
      amount: sign == "+" ? data.amount : data.amount * (-1),
      date: format(new Date(data.date), "dd.MM.yy"),
    }).then(() => {
      updateLastUpdateDate("staff", staffID).catch((error) => {
        console.error(error.message());
        showToast(error.name, "Failed to update the last update date", "error");
      });
    }).finally(() => {
      setOpen(false);
      window.location.reload();
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button variant="accent">
          <MdAddCircle/> Add New Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className={"border-2 border-blue-500"}>
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Click submit to add the new transaction.
          </DialogDescription>
        </DialogHeader>
        <form className="flex-col space-y-4" onSubmit={handleSubmit(onSubmit)} onReset={() => reset}>
          <InputDropDown label="Title"
                        options={StaffTransactionTypeOptions ?? []}
                        {...register('title')}
                        error={errors.title?.message || ""}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        required
          />
          <InputText label="Details"
                    {...register("details")}
                    error={errors.details?.message || ""}
          />
          <InputText label="Amount"
                    type="number"
                    min={0}
                    {...register("amount", {valueAsNumber: true})}
                    pre="৳"
                    sign={sign == "-" ? "-" : ""}
                    error={errors.amount?.message || ""}
          />
          <InputDate label="Date"
                    type="date"
                    {...register("date")}
                    error={errors.date?.message || ""}
                    required
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