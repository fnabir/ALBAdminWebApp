"use client"

import Layout from "@/components/layout";
import {usePathname} from "next/navigation";
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
import {MdAddCircle, MdError} from "react-icons/md";
import CustomSeparator from "@/components/generic/CustomSeparator";
import CustomDropDown from "@/components/generic/CustomDropDown";
import CustomInput from "@/components/generic/CustomInput";
import {callbackStatusOptions} from "@/lib/arrays";
import CustomDateTimeInput from "@/components/generic/CustomDateTimeInput";
import {ScrollArea} from "@/components/ui/scrollArea";
import {Skeleton} from "@/components/ui/skeleton";
import CardIcon from "@/components/card/cardIcon";
import React, {useState} from "react";
import {getDatabaseReference} from "@/lib/utils";
import {useList} from "react-firebase-hooks/database";
import {useForm} from "react-hook-form";
import {CallbackFormData, callbackSchema} from "@/lib/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import CardCallbackProject from "@/components/card/cardCallbackProject";
import {addNewCallback} from "@/lib/functions";
import {format} from "date-fns";

export default function CallbackProjectPage() {
	const path = usePathname();
	const projectName: string = decodeURIComponent(path.substring(path.lastIndexOf("/") + 1));

	const [dialog, setDialog] = useState<boolean>(false);
	const [ data, dataLoading, dataError ] = useList(getDatabaseReference(`callback/${projectName}`));
	const breadcrumb: {text: string, link?: string}[] = [
		{ text: "Home", link: "/" },
		{ text: "/" },
		{ text: "Callback", link: "/callback" },
		{ text: "/" },
		{ text: projectName },
	]

	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<CallbackFormData>({
		resolver: zodResolver(callbackSchema),
		defaultValues: {project: projectName},
	});

	const onSubmit = (data: CallbackFormData) => {
		addNewCallback(projectName, data.date, {
			details: data.details,
			name: data.name,
			status: data.status,
			date: format(new Date(data.date), "dd.MM.yy"),
		}).finally(() => {
			setDialog(false);
			window.location.reload();
		});
	};

	const handleReset = () => {
		reset();
	};

	return (
		<Layout breadcrumb={breadcrumb}>
			<div className={"flex flex-col h-full"}>
				<div className="flex items-center pt-1 pb-2 gap-x-2">
					<Dialog open={dialog} onOpenChange={setDialog}>
						<DialogTrigger asChild>
							<Button variant={"accent"} onClick={handleReset}>
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
							<CustomSeparator orientation={"horizontal"}/>
							<form onSubmit={handleSubmit(onSubmit)}
										className="flex-col mt-4 space-y-4">
								<CustomInput id="details"
														 type="text"
														 label={"Details"}
														 {...register('details')}
														 helperText={errors.details ? errors.details.message : ""}
														 color={errors.details ? "error" : "default"}
														 required
								/>
								<CustomInput id="name"
														 type="text"
														 label={"Name"}
														 {...register('name')}
														 helperText={errors.name ? errors.name.message : ""}
														 color={errors.name ? "error" : "default"}
														 required
								/>
								<CustomDropDown id="status"
																label="Status"
																options={callbackStatusOptions}
																{...register('status')}
																helperText={errors.status ? errors.status.message : ""}
																color={errors.status ? "error" : "default"}
																required
								/>
								<CustomDateTimeInput id="date"
																		 type="date"
																		 label="Date"
																		 helperText={errors.date ? errors.date.message : ""}
																		 color={errors.date ? "error" : "default"}
																		 {...register("date")}
																		 required
								/>
								<DialogFooter className={"sm:justify-center pt-8"}>
									<DialogClose asChild>
										<Button type="button" size="lg" variant="secondary">Close</Button>
									</DialogClose>
									<Button type="button" size="lg" variant="secondary" onClick={handleReset}>Reset</Button>
									<Button type="submit" size="lg" variant="accent">Save</Button>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>
				</div>
				<ScrollArea className={"grow mb-4 -mr-4 pr-4"}>
					{
						dataLoading ?
							<div className="p-4 rounded-xl bg-muted/100 flex items-center">
								<div className={"flex-auto"}>
									<Skeleton className="h-6 mb-1 w-2/5 rounded-xl"/>
								</div>
								<Skeleton className="h-6 w-32 mr-4 rounded-xl"/>
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
									: <div className="space-y-2">
										{
											data.sort((a, b) => b.key!.localeCompare(a.key!)).map((item) => {
												const snapshot = item.val();
												return (
													<div key={item.key}>
														<CardCallbackProject project={projectName}
																								 id={item.key!}
																								 details={snapshot.details}
																								 name={snapshot.name}
																								 status={snapshot.status}
																								 date={snapshot.date}
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