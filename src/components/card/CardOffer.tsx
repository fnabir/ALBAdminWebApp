import {MdDelete, MdEditNote} from "react-icons/md";
import React, {useState} from "react";
import {Card} from "@/components/ui/card";
import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {deleteOffer, updateOffer} from "@/lib/functions";
import {useForm} from "react-hook-form";
import {OfferFormData, offerSchema} from "@/lib/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import CustomSeparator from "@/components/generic/CustomSeparator";
import CustomInput from "@/components/generic/CustomInput";
import {offerProductOptions, offerWorkOptions} from "@/lib/arrays";
import CustomDropDown from "@/components/generic/CustomDropDown";
import {OfferInterface} from "@/lib/interfaces"

const CardOffer: React.FC<OfferInterface & {userAccess?: string}> = ({id, name, address, work, product, unit, floor, person, shaft, note, refer, date, userAccess}) => {
  const [editDialog, setEditDialog] = useState<boolean>(false);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);

  const line1 = address ?  `${name} - ${address}` : `${name}`;
  const line2 = work + " - " + (product ? product + (unit ? `(${unit})` : "") : "");
  const line3 = (floor ? `Floor/Stop: ${floor} | ` : "") + (person ? `Person/Load: ${person} | ` : "") + (shaft ? `Shaft Dimension: ${shaft} ` : "");
  const line4 = (note ? `${note} | ` : "") + (refer ? `${refer}` : "");

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      name: name,
      address: address,
      product: product,
      work: work,
      unit: unit,
      person: person,
      floor: floor,
      shaft: shaft,
      note: note,
    },
  });

  const onSubmit = (data: OfferFormData) => {
    updateOffer(id, {
      name: data.name,
      address: data.address,
      product: data.product,
      work: data.work,
      unit: data.unit,
      floor: data.floor,
      person: data.person,
      shaft: data.shaft,
      note: data.note,
    }).finally(() => {
      setEditDialog(false);
      window.location.reload();
    })
  }

  const handleReset = () => {
    reset();
  };

  const handleDelete = () => {
    deleteOffer(id).finally(() => {
      setDeleteDialog(false);
      window.location.reload();
    });
  };

  return (
    <Card
      className={`flex w-full p-1 text-start bg-muted hover:bg-muted/80 items-center`}>
      <div className="w-full mx-auto px-6 pt-1 md:flex md:items-center md:justify-between text-primary">
        <div className="w-28">
          {date}
        </div>
        <div className="flex-auto">
          <div className="font-semibold">{line1}</div>
          <div>{line2}</div>
          <div>{line3}</div>
          <div>{line4}</div>
        </div>
        <div className={"flex mx-2 space-x-2"}>
          <Dialog open={editDialog} onOpenChange={setEditDialog}>
            <DialogTrigger asChild>
              <button onClick={handleReset}
                      className={"p-2 bg-black bg-opacity-40 rounded-lg hover:bg-opacity-70"}>
                <MdEditNote color={"white"} size={24}/>
              </button>
            </DialogTrigger>
            <DialogContent className={"border border-blue-500"}>
              <DialogHeader>
                <DialogTitle>Edit Offer</DialogTitle>
                <DialogDescription>
                  Click update to save the changes.
                </DialogDescription>
              </DialogHeader>
              <CustomSeparator orientation={"horizontal"}/>
              <form onSubmit={handleSubmit(onSubmit)}>
                <CustomInput id="name"
                             type="text"
                             label={"Project Name"}
                             {...register('name')}
                             helperText={errors.name ? errors.name.message : ""}
                             color={errors.name ? "error" : "default"}
                             required
                />
                <CustomInput id="address"
                             type="text"
                             label={"Address"}
                             {...register('address')}
                />
                <CustomDropDown id="product"
                                label="Product Type"
                                options={offerProductOptions}
                                {...register('product')}
                                helperText={errors.product ? errors.product.message : ""}
                                color={errors.product ? "error" : "default"}
                                required
                />
                <CustomDropDown id="work"
                                label="Work Type"
                                options={offerWorkOptions}
                                {...register('work')}
                                helperText={errors.work ? errors.work.message : ""}
                                color={errors.work ? "error" : "default"}
                                required
                />
                <div className="flex space-x-2">
                  <div className="flex-auto">
                    <CustomInput id="person"
                                 type="text"
                                 label={"Person/Load"}
                                 {...register('person')}
                    />
                  </div>
                  <div className="flex-auto">
                    <CustomInput id="floor"
                                 type="text"
                                 label={"Floor/Stop"}
                                 {...register('floor')}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-[1_1_40]">
                    <CustomInput id="unit"
                                 type="text"
                                 label={"Unit"}
                                 {...register('unit')}
                    />
                  </div>
                  <div className="flex-auto">
                    <CustomInput id="shaft"
                                 type="text"
                                 label={"Shaft Size (W x D x H)"}
                                 {...register('shaft')}
                    />
                  </div>
                </div>
                <CustomInput id="note"
                             type="text"
                             label={"Note"}
                             {...register('note')}
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
          {userAccess === "admin" &&
            <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
              <DialogTrigger asChild>
                <button className={"p-2 bg-black bg-opacity-40 rounded-lg hover:bg-opacity-70"}>
                  <MdDelete color={"white"} size={24}/>
                </button>
              </DialogTrigger>
              <DialogContent className={"border border-destructive"}>
                <DialogHeader>
                  <DialogTitle>Delete Offer</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete the offer.
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
          }
        </div>
      </div>
    </Card>
)
};

export default CardOffer;