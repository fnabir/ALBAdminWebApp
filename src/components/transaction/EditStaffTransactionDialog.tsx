import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MdDelete } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { TransactionFormData, TransactionFormSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { updateTransaction } from "@/lib/functions";
import { ButtonLoading } from "@/components/generic/ButtonLoading";
import InputDropDown from "@/components/generic/InputDropdown";
import InputText from "@/components/generic/InputText";
import { InputDate } from "@/components/generic/InputDate";
import { StaffTransactionTypeOptions } from "@/lib/arrays";

type Props = {
  type: string;
  uid: string;
  transactionId: string;
  title: string;
  details?: string;
  amount: number;
  date: string;
};

export default function EditStaffTransactionDialog({ type, uid, transactionId, title, details, amount, date}: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [sign, setSign] = useState<string>(amount < 0 ? "-" : "+");

  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(TransactionFormSchema),
    defaultValues: { title: title, details: details, amount: Math.abs(amount), date: format(parse(date, "dd.MM.yy", new Date()), 'yyyy-MM-dd') },
  });

  const onSubmit = (data: TransactionFormData) => {
    updateTransaction(type, uid, transactionId, {
      title: data.title,
      details: data.details,
      amount: sign == "+" ? data.amount : data.amount * (-1),
      date: format(new Date(data.date), "dd.MM.yy"),
    }).finally(() => {
      setOpen(false);
      window.location.reload();
    })
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon"><MdDelete className="size-6"/></Button>
      </DialogTrigger>
      <DialogContent className={"border-2 border-blue-500"}>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
              Edit and submit to save the changes.
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
                    sign={sign == "+" ? "" : sign}
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