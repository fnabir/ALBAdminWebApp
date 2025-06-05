import { updateOffer } from "@/lib/functions";
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
import { MdEditNote } from "react-icons/md";
import InputDropDown from "@/components/generic/InputDropdown";
import { OfferProductOptions, OfferWorkOptions } from "@/lib/arrays";
import InputText from "@/components/generic/InputText";
import { ButtonLoading } from "@/components/generic/ButtonLoading";
import InputTextarea from "@/components/generic/InputTextarea";
import { DataSnapshot } from "firebase/database";
import { OfferInterface } from "@/lib/interfaces";

type Props = {
  data: DataSnapshot;
};

export default function EditOfferDialog({ data }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const val = data.val() as OfferInterface;
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OfferFormData>({
    resolver: zodResolver(OfferFormSchema),
  });
  
  const onSubmit = (formData: OfferFormData) => {
    updateOffer(data.key!, {
      name: formData.name,
      address: formData.address,
      product: formData.product,
      work: formData.work,
      unit: formData.unit,
      floor: formData.floor,
      person: formData.person,
      shaft: formData.shaft,
      note: formData.note,
    }).finally(() => {
      setOpen(false);
      window.location.reload();
    })
  }

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
          <InputText label="Project Name"
                    defaultValue={val.name}
                    {...register("name")}
                    error={errors.name?.message || ""}
                    required
          />
          <InputText label="Address"
                    defaultValue={val.address}
                    {...register("address")}
                    error={errors.address?.message || ""}
          />
          <InputDropDown label="Product Type"
                        options={OfferProductOptions ?? []}
                        defaultValue={val.product}
                        {...register('product')}
                        error={errors.product?.message || ""}
                        required
          />
          <InputDropDown label="Work Type"
                        options={OfferWorkOptions ?? []}
                        defaultValue={val.work}
                        {...register('work')}
                        error={errors.work?.message || ""}
                        required
          />
          <div className="flex space-x-2">
            <InputText label="Person/Load"
                      defaultValue={val.person}
                      {...register("person")}
                      error={errors.person?.message || ""}
                      className="flex-auto"
            />
            <InputText label="Floor/Stop"
                      defaultValue={val.floor}
                      {...register("floor")}
                      error={errors.floor?.message || ""}
                      className="flex-auto"
            />
          </div>
          <div className="flex space-x-2">
            <InputText label="Unit"
                      defaultValue={val.unit}
                      {...register("unit")}
                      error={errors.unit?.message || ""}
                      className="flex-[1_1_40]"
            />
            <InputText label="Shaft Size (W x D x H)"
                      defaultValue={val.shaft}
                      {...register("shaft")}
                      error={errors.shaft?.message || ""}
                      className="flex-auto"
            />
					</div>
          <InputTextarea label="Note"
                        defaultValue={val.note}
                        {...register('note')}
                        error={errors.note?.message || ""}
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