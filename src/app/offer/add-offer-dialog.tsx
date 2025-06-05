import { addNewOffer } from "@/lib/functions";
import { OfferFormData, OfferFormSchema } from "@/lib/schemas";
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
import { OfferProductOptions, OfferWorkOptions } from "@/lib/arrays";
import InputText from "@/components/generic/InputText";
import { ButtonLoading } from "@/components/generic/ButtonLoading";
import { format } from "date-fns";
import InputTextarea from "@/components/generic/InputTextarea";

type Props = {
  userName: string | null;
};

export default function AddOfferDialog({ userName }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OfferFormData>({
    resolver: zodResolver(OfferFormSchema),
  });

  const onSubmit = (data: OfferFormData) => {
    addNewOffer({
      name: data.name,
      address: data.address,
      product: data.product,
      work: data.work,
      unit: data.unit,
      floor: data.floor,
      person: data.person,
      shaft: data.shaft,
      note: data.note,
      refer: userName,
      date: format(new Date(), "dd MMM yyyy"),
    }).finally(() => {
      setOpen(false);
    })
  }

  const handleDialogOpenChange = (state: boolean) => {
    setOpen(state);
    reset();
  };

  return(
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant={"accent"}>
          <MdAddCircle/> Add New Offer
        </Button>
      </DialogTrigger>
      <DialogContent className={"border border-accent"}>
        <DialogHeader>
          <DialogTitle>Add New Payment Info</DialogTitle>
          <DialogDescription>
            Click submit to add the new payment info.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} onReset={() => reset}>
          <InputText label="Project Name"
                    {...register("name")}
                    error={errors.name?.message || ""}
                    required
          />
          <InputText label="Address"
                    {...register("address")}
                    error={errors.address?.message || ""}
          />
          <InputDropDown label="Product Type"
                        options={OfferProductOptions ?? []}
                        {...register('product')}
                        error={errors.product?.message || ""}
                        required
          />
          <InputDropDown label="Work Type"
                        options={OfferWorkOptions ?? []}
                        {...register('work')}
                        error={errors.work?.message || ""}
                        required
          />
          <div className="flex space-x-2">
            <InputText label="Person/Load"
                      {...register("person")}
                      error={errors.person?.message || ""}
                      className="flex-auto"
            />
            <InputText label="Floor/Stop"
                      {...register("floor")}
                      error={errors.floor?.message || ""}
                      className="flex-auto"
            />
          </div>
          <div className="flex space-x-2">
            <InputText label="Unit"
                      {...register("unit")}
                      error={errors.unit?.message || ""}
                      className="flex-[1_1_40]"
            />
            <InputText label="Shaft Size (W x D x H)"
                      {...register("shaft")}
                      error={errors.shaft?.message || ""}
                      className="flex-auto"
            />
					</div>
          <InputTextarea label="Note"
                        {...register('note')}
                        error={errors.shaft?.message || ""}
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