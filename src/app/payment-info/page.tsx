"use client"

import Layout from "@/components/layout";
import {useList, useListKeys} from "react-firebase-hooks/database";
import {getDatabaseReference} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scrollArea";
import CardIcon from "@/components/card/cardIcon";
import {Skeleton} from "@/components/ui/skeleton";
import {MdAddCircle, MdError} from "react-icons/md";
import React, {useEffect, useState} from "react";
import {Card} from "@/components/ui/card";
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
import CustomDropDown from "@/components/generic/CustomDropDown";
import {useForm} from "react-hook-form";
import {PaymentInfoFormData, paymentInfoSchema} from "@/lib/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {paymentInfoOptions} from "@/lib/arrays";
import CustomInput from "@/components/generic/CustomInput";
import {addNewPaymentInfo} from "@/lib/functions";
import {useAuth} from "@/hooks/useAuth";
import CardPaymentInfo from "@/components/card/cardPaymentInfo";
import {useRouter} from "next/navigation";
import Loading from "@/components/loading";

export default function PaymentInfoPage() {
	const { user, loading, userRole } = useAuth();
	const router = useRouter();

	const breadcrumb: {text: string, link?: string}[] = [
		{ text: "Home", link: "/" },
		{ text: "/" },
		{ text: "Payment Info" },
	]

	const [open, setOpen] = useState<boolean>(false);
	const [details, setDetails] = useState<boolean>(false);
	const [detailsLabel, setDetailsLabel] = useState<string>("Details");
	const [paymentData, paymentLoading, paymentError] = useList(getDatabaseReference("info/payment"));
	const projectNames = useListKeys(getDatabaseReference(`balance/project`))[0];
	const projectNameOptions = projectNames?.map((projectName) => ({ value: projectName}))

	const {
		register,
		setValue,
		getValues,
		watch,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<PaymentInfoFormData>({
		resolver: zodResolver(paymentInfoSchema),
	});

	const onSubmit = (data: PaymentInfoFormData) => {
		addNewPaymentInfo(data).finally(() => {
			setOpen(false);
			window.location.reload();
		})
	}

	useEffect(() => {
		if (!loading && !user) {
			router.push('/login');
		}
	}, [user, loading, router])

	if (loading) return <Loading/>

	return (
		<Layout breadcrumb={breadcrumb}>
			<div className={"flex flex-col h-full"}>
				<div className="flex items-center pb-2 gap-x-2">
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<Button variant={"accent"} onClick={() => reset()}>
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
							<CustomSeparator orientation={"horizontal"}/>
							<form onSubmit={handleSubmit(onSubmit)}
										className="flex-col space-y-4">
								<CustomDropDown id="project"
																label="Project Name"
																options={projectNameOptions ? projectNameOptions : []}
																{...register('project')}
																helperText={errors.project ? errors.project.message : ""}
																color={errors.project ? "error" : "default"}
																required
								/>
								{ watch("project") !== "Select" &&
									<CustomDropDown id="type"
																	label="Payment Info Type"
																	options={paymentInfoOptions}
																	{...register('type')}
																	onChange={(e) => {
																		switch (e.target.value) {
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
																	}}
																	helperText={errors.type ? errors.type.message : ""}
																	color={errors.type ? "error" : "default"}
																	required
									/>
								}
								{details &&
									<CustomInput id="details"
															 type="text"
															 label={detailsLabel}
															 {...register('details')}
															 helperText={errors.details ? errors.details.message : ""}
															 color={errors.details ? "error" : "default"}
									/>
								}
								<DialogFooter className={"sm:justify-center pt-2"}>
									<DialogClose asChild>
										<Button type="button" size="lg" variant="secondary">Close</Button>
									</DialogClose>
									<Button type="button" size="lg" variant="secondary" onClick={() => reset()}>Reset</Button>
									<Button type="submit" size="lg" variant="accent">Save</Button>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>
				</div>
				<ScrollArea className={"flex-grow -mr-4 pr-4 mb-2"}>
					{
						paymentLoading ?
							<div className="grid auto-rows-min gap-4 mt-4 md:grid-cols-3">
								<Skeleton className="w-full h-10 rounded-xl"/>
								<Skeleton className="w-full h-10 rounded-xl"/>
								<Skeleton className="w-full h-10 rounded-xl"/>
								<Skeleton className="w-full h-10 rounded-xl"/>
								<Skeleton className="w-full h-10 rounded-xl"/>
								<Skeleton className="w-full h-10 rounded-xl"/>
							</div>
						: paymentError ?
							<CardIcon
								title={"Error"}
								description={paymentError.message}>
								<MdError size={28}/>
							</CardIcon>
						: !paymentData || paymentData.length == 0 ?
							<CardIcon
								title={"No Record Found"}>
								<MdError size={28}/>
							</CardIcon>
						: <div className="grid auto-rows-min gap-4 md:grid-cols-3">
							{
								paymentData.map((item, typeIndex) => {
									const details = item.val();
									return (
										<Card
											key={item.key}
											className="bg-muted p-2 opacity-0 animate-fade-in"
											style={{ animationDelay: `${typeIndex * 0.3}s` }}>
											<h3 className="text-lg text-center font-bold mb-1 uppercase">{item.key === "bank" || item.key === "account" ? `${item.key!} transfer` : item.key === "cell" ? "cellfin" : item.key!}</h3>
											<ul className={"space-y-1 text-sm gap-x-2"}>
												{Object.entries(details).map(([key, value], index) => (
													<CardPaymentInfo
														type={item.key!}
														key={key}
														id={key}
														value={value!.toString()}
														userRole={userRole}
														animationDelay={typeIndex * 0.3 + 0.2 + index * 0.1}
													/>
												))}
											</ul>
										</Card>
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