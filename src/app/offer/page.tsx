"use client"

import Layout from "@/components/layout"
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scrollArea";
import {Skeleton} from "@/components/ui/skeleton";
import CardIcon from "@/components/card/cardIcon";
import {MdAddCircle, MdError} from "react-icons/md";
import {DataSnapshot} from "@firebase/database";
import {
	Dialog, DialogClose,
	DialogContent,
	DialogDescription, DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import CustomSeparator from "@/components/generic/CustomSeparator";
import React, {useState} from "react";
import {useList} from "react-firebase-hooks/database";
import {getDatabaseReference} from "@/lib/utils";
import CardOffer from "@/components/card/cardOffer";
import {useAuth} from "@/hooks/useAuth";
import {useForm} from "react-hook-form";
import {OfferFormData, offerSchema} from "@/lib/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import CustomInput from "@/components/generic/CustomInput";
import CustomDropDown from "@/components/generic/CustomDropDown";
import {offerProductOptions, offerWorkOptions} from "@/lib/arrays";
import {addNewOffer} from "@/lib/functions";
import {format} from "date-fns";

export default function OfferPage() {
	const { user, userRole } = useAuth();
	const [ data, dataLoading, dataError ] = useList(getDatabaseReference('offer'));
	const [newOfferDialog, setNewOfferDialog] = useState<boolean>(false);

	const breadcrumb: {text: string, link?: string}[] = [
		{ text: "Home", link: "/" },
		{ text: "/" },
		{ text: "Offer" },
	];

	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<OfferFormData>({
		resolver: zodResolver(offerSchema),
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
			refer: user?.displayName,
			date: format(new Date(), "dd MMM yyyy"),
		}).finally(() => {
			setNewOfferDialog(false);
			window.location.reload();
		})
	}

	const handleReset = () => {
		reset();
	};

	return (
		<Layout breadcrumb={breadcrumb}>
			<div className={"flex flex-col h-full"}>
				<div className="flex items-center pb-2 gap-x-2">
					<Dialog open={newOfferDialog} onOpenChange={setNewOfferDialog}>
						<DialogTrigger asChild>
							<Button variant={"accent"}>
								<MdAddCircle/> Add New Offer
							</Button>
						</DialogTrigger>
						<DialogContent className={"border border-blue-500"}>
							<DialogHeader>
								<DialogTitle>Add New Offer</DialogTitle>
								<DialogDescription>
									Click save to save the new offer.
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
				</div>
				<ScrollArea className={"grow -mr-4 pr-4 mb-2"}>
					{
						dataLoading ?
							<div className="p-4 rounded-xl bg-muted/100 flex items-center">
								<Skeleton className="flex-wrap h-6 w-24 mr-4 rounded-xl"/>
								<div className={"flex-auto space-y-1"}>
									<Skeleton className="h-6 w-3/5 rounded-xl"/>
									<Skeleton className="h-4 w-1/3 rounded-xl"/>
									<Skeleton className="h-4 w-1/2 rounded-xl"/>
									<Skeleton className="h-4 w-2/5 rounded-xl"/>
								</div>
							</div>
						: dataError ?
							<CardIcon
								title={"Error"}
								description={dataError.message}>
								<MdError size={28}/>
							</CardIcon>
						: !data || data.length == 0 ?
							<CardIcon
								title={"No Record Found"}>
								<MdError size={28}/>
							</CardIcon>
						: <div className={"space-y-2"}>
							{
								data.sort((a: DataSnapshot, b: DataSnapshot) => a.key!.localeCompare(b.key!)).map((item: DataSnapshot) => {
									const snapshot = item.val();
									return (
										<div key={item.key}>
											<CardOffer id={item.key!} name={snapshot.name} address={snapshot.address}
																 product={snapshot.product} work={snapshot.work} unit={snapshot.unit}
																 floor={snapshot.floor} person={snapshot.person} shaft={snapshot.shaft}
																 date={snapshot.date} note={snapshot.note} refer={snapshot.refer} userAccess={userRole}
											/>
										</div>
									)
								})
							}
						</div>
					}
				</ScrollArea>
			</div>
		</Layout>
	)
}