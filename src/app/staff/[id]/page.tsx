"use client"

import Layout from "@/components/layout";
import CardTotalBalance from "@/components/card/cardTotalBalance";
import {useList, useObject} from "react-firebase-hooks/database";
import {getDatabaseReference, getTotalValue, showToast} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scrollArea";
import CardIcon from "@/components/card/cardIcon";
import {Skeleton} from "@/components/ui/skeleton";
import {MdAddCircle, MdError} from "react-icons/md";
import {usePathname, useRouter} from "next/navigation";
import React, {useState} from "react";
import {useAuth} from "@/hooks/useAuth";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
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
import CustomSeparator from "@/components/generic/CustomSeparator";
import Loading from "@/app/staff/[id]/loading";
import CardTransaction from "@/components/card/cardTransaction";
import {addNewTransaction, updateLastUpdateDate, updateTransactionBalance} from "@/lib/functions";
import {useForm} from "react-hook-form";
import {TransactionFormData, transactionSchema} from "@/lib/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {staffTransactionTypeOptions} from "@/lib/arrays";
import CustomDropDown from "@/components/generic/CustomDropDown";
import CustomInput from "@/components/generic/CustomInput";
import CustomDateTimeInput from "@/components/generic/CustomDateTimeInput";
import {format} from "date-fns";

export default function StaffTransactionPage() {
	const {user, loading, userRole} = useAuth();
	const router = useRouter();
	const path = usePathname();
	const staffID: string = decodeURIComponent(path.substring(path.lastIndexOf("/") + 1));
	const [staffData] = useObject(getDatabaseReference(`balance/conveyance/${staffID}`));
	const staffName = staffData?.val().name;

	const [open, setOpen] = useState(false);
	const [, setType] = useState<string>("+");
	const breadcrumb: {text: string, link?: string}[] = [
		{ text: "Home", link: "/" },
		{ text: "/" },
		{ text: "Staff", link: "/staff" },
		{ text: "/" },
		{ text: staffName },
	]

	const [ data, dataLoading, dataError ] = useList(getDatabaseReference('transaction/staff/' + staffID));
	const total = getTotalValue(data, "amount");
	const [ totalBalanceData, totalBalanceLoading ] = useObject(getDatabaseReference(`balance/staff/${staffID}`));
	const conveyanceValue: number = staffData ? staffData.val().value : 0;
	const totalBalanceValue: number = totalBalanceData ? totalBalanceData.val().value : 0;
	const totalBalanceDate = totalBalanceData?.val().date;

	const {
		register,
		setValue,
		getValues,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TransactionFormData>({
		resolver: zodResolver(transactionSchema),
	});

	const handleTitleChange = (value: string) => {
		switch (value) {
			case "Advance":
			case "For Conveyance":
			case "House Rent":
			case "Payment":
			case "Others":
				setValue("type", "-");
				setType("-");
				setValue("details", "");
				break;
			case "Salary":
			case "Bonus":
			case "Cashback":
				setValue("type", "+");
				setType("+");
				setValue("details", "");
				break;
			default:
				setValue("type", "-");
				setType("-");
				setValue("details", "");
				break;
		}
	}

	const onSubmit = (data: TransactionFormData) => {
		//const newTransactionRef: DatabaseReference = getDatabaseReference(`transaction/project/${projectName}/${format(new Date(data.date), "yyMMdd")}${generateDatabaseKey(`transaction/project/${projectName}`)}`);
		//const newKey: string = newTransactionRef.key!;
		addNewTransaction("staff", staffID	, data.date, {
			title: data.title,
			details: data.details,
			amount: data.type == "+" ? data.amount : data.amount * (-1),
			date: format(new Date(data.date), "dd.MM.yy"),
		}).then(() => {
			updateLastUpdateDate("staff", staffID).catch((error) => {
				console.error(error.message());
				showToast(error.name, "Failed to update the last update date", "destructive");
			});
		}).finally(() => {
			setOpen(false);
			window.location.reload();
		});
	};

	const handleReset = () => {
		reset();
	};

	const handleUpdateBalance = () => {
		updateTransactionBalance("staff", staffID, total).then(() => {
			showToast("Success", "Total balance updated successfully", "success");
		}).catch((error) => {
			showToast("Error", `Error updating total balance: ${error.message}`, "destructive");
		})
	}

	if (loading) return <Loading/>

	if (!user) {
		router.push("/login");
		return null;
	}

	return (
		<Layout breadcrumb={breadcrumb}>
			<div className={"flex flex-col h-full"}>
				<div className="flex items-center py-2 gap-x-2">
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<Button variant={"accent"} onClick={handleReset}>
								<MdAddCircle/> Add New Transaction
							</Button>
						</DialogTrigger>
						<DialogContent className={"border border-accent"}>
							<DialogHeader>
								<DialogTitle>Add New Transaction</DialogTitle>
								<DialogDescription>
									Click submit to add the new transaction.
								</DialogDescription>
							</DialogHeader>
							<CustomSeparator orientation={"horizontal"}/>
							<form onSubmit={handleSubmit(onSubmit)}
										className="flex-col space-y-4">
								<CustomDropDown id="title"
																label="Title"
																options={staffTransactionTypeOptions}
																{...register('title')}
																helperText={errors.title ? errors.title.message : ""}
																color={errors.title ? "error" : "default"}
																onChange={(e) => handleTitleChange(e.target.value)}
																required
								/>
								<CustomInput id="details"
														 type="text"
														 label="Details"
														 {...register('details')}
														 helperText={errors.details ? errors.details.message : ""}
														 color={errors.details ? "error" : "default"}
								/>
								<CustomInput id="amount"
														 type="number"
														 label="Amount"
														 min={0}
														 step={1}
														 {...register("amount", {valueAsNumber: true})}
														 pre="৳"
														 sign={getValues("type") == "-" ? "-" : ""}
														 helperText={errors.amount ? errors.amount.message : ""}
														 color={errors.amount ? "error" : "default"}
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
										<Button type="button" size="lg" variant="secondary">
											Close
										</Button>
									</DialogClose>
									<Button type="submit" size="lg" variant="accent">Save</Button>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>

					{!dataLoading && !totalBalanceLoading && total != totalBalanceValue &&
            <div className={"flex gap-x-2 h-full"}>
              <Separator orientation={`vertical`}/>
              <Button variant="accent" onClick={handleUpdateBalance}>
                Update Total Balance
              </Button>
            </div>
					}
				</div>
				<ScrollArea className={"flex-grow mb-2 -mr-4 pr-4"}>
					{
						dataLoading ?
							<div className="p-4 rounded-xl bg-muted/100 flex items-center">
								<Skeleton className="flex-wrap h-10 w-10 mr-4 rounded-full"/>
								<div className={"flex-auto"}>
									<Skeleton className="h-6 mb-1 w-1/2 rounded-xl"/>
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
									: <div className="space-y-2">
										{
											data.sort((a, b) => b.key!.localeCompare(a.key!)).map((item) => {
												const snapshot = item.val();
												return (
													<div key={item.key}>
														<CardTransaction type={"staff"} uid={staffID} transactionId={item.key!}
																						 title={snapshot.title} details={snapshot.details}
																						 amount={snapshot.amount} date={snapshot.date} access={userRole}/>
													</div>
												)
											})
										}
									</div>
					}
				</ScrollArea>
				<div>
					{staffData &&
            <CardTotalBalance className={"mb-2"} text={"Conveyance Balance"} value={conveyanceValue}
                              date={staffData?.val().date}/>}
				</div>
				<div>
					{totalBalanceData &&
            <CardTotalBalance value={total + conveyanceValue}
                              date={totalBalanceDate}
                              onClick={handleUpdateBalance}
                              update={total != totalBalanceValue}/>
					}
				</div>
			</div>
		</Layout>
	)
}