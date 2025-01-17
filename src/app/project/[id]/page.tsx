"use client"

import Layout from "@/components/layout";
import CardTotalBalance from "@/components/card/cardTotalBalance";
import {useList, useObject} from "react-firebase-hooks/database";
import {formatCurrency, generateDatabaseKey, getDatabaseReference, getTotalValue, showToast} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scrollArea";
import CardIcon from "@/components/card/cardIcon";
import {Skeleton} from "@/components/ui/skeleton";
import {MdAddCircle, MdDelete, MdError} from "react-icons/md";
import {usePathname} from "next/navigation";
import React, {useState} from "react";
import {useAuth} from "@/hooks/useAuth";
import CardTransactionProject from "@/components/card/cardTransactionProject";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import CustomButtonGroup from "@/components/generic/CustomButtonGroup";
import {
	projectExpenseOptions,
	projectPaymentOptions,
	projectPaymentTypeOptions,
	projectTransactionFilterOptions,
	projectTransactionOptions
} from "@/lib/arrays";
import {FullPaymentDataType, PartialPaymentDataType, projectTransaction} from "@/lib/types";
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
import CustomRadioGroup from "@/components/generic/CustomRadioGroup";
import CustomDropDown from "@/components/generic/CustomDropDown";
import CustomInput from "@/components/generic/CustomInput";
import {useForm} from "react-hook-form";
import {TransactionFormData, transactionSchema} from "@/lib/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {format} from "date-fns";
import {updateLastUpdateDate, updateTransactionBalance} from "@/lib/functions";
import {set, update} from "firebase/database";

export default function ProjectTransactionPage() {
	const { userRole } = useAuth();
  const path = usePathname();
	const projectName: string = decodeURIComponent(path.substring(path.lastIndexOf("/") + 1));

	const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('none');
	const breadcrumb: {text: string, link?: string}[] = [
		{ text: "Home", link: "/" },
		{ text: "/" },
		{ text: "Project", link: "/project" },
		{ text: "/" },
		{ text: projectName },
	]

	const transactionColourInfo = {
		expense: {
			1: {
				colour: "green-900",
				details: "৳0 expense such as Free servicing, etc.",
			},
			2: {
				colour: "red-900",
				details: "No payment record",
			},
			3: {
				colour: "accent",
				details: "Payment record covering partial of the expense amount"
			},
			4: {
				colour: "green-900",
				details: "Payment record covering the full expense amount"
			},
			5: {
				colour: "yellow-900",
				details: "Payment record covering more than the expense amount"
			}
		},
		payment: {
			1: {
				colour: "muted",
				details: "No expense record"
			},
			2: {
				colour: "accent",
				details: "Expense record covering the partial amount of payment"
			},
			3: {
				colour: "green-900",
				details: "Expense record covering the full amount of payment"
			},
			4: {
				colour: "yellow-900",
				details: "Expense record covering more than the payment amount"
			},
		}
	}

	const [ data, dataLoading, dataError ] = useList(getDatabaseReference(`transaction/project/${projectName}`));
	const total = getTotalValue(data, "amount");
	const [totalBalanceData, totalBalanceLoading] = useObject(getDatabaseReference(`balance/project/${projectName}`));
	const totalBalanceValue: number = totalBalanceData?.val().value;
	const totalBalanceDate = totalBalanceData?.val().date;
	const servicingCharge: number = useObject(getDatabaseReference(`info/project/${projectName}/servicing`))[0]?.val();
	const paidDataOptions = data?.filter(t=> t.val().amount < 0)
		.sort((a, b) => b.key!.localeCompare(a.key!))
		.map((item) => ({value: item.key!, label: `${item.val().date} ${item.val().title}: ${formatCurrency(Math.abs(item.val().amount))}`}));

	const [fullPaymentData, setFullPaymentData] = useState<FullPaymentDataType>({key: '', details: ''})
	const [partialDataSets, setPartialDataSets] = useState<PartialPaymentDataType[]>([
		{ id: 1, key: '', details: "", amount: 0 },
	]);

	const transactionData: projectTransaction[] = data ? data.map((snapshot) => ({
			...(snapshot.val() as projectTransaction),
			id: snapshot.key!,
		}))
		: [];

	const filteredData = transactionData?.filter((item) =>
		filter === "+" ? item.amount >= 0
			: filter === "-" ? item.amount < 0
			: true
	);

	const {
		register,
		setValue,
		getValues,
		handleSubmit,
		formState: { errors },
	} = useForm<TransactionFormData>({
		resolver: zodResolver(transactionSchema),
		defaultValues: { type: "+", title: "Select", details: "", amount: 0, date: "" },
	});

	const [titleLabel, setTitleLabel] = useState<string>("Expense Type");
	const [detailsLabel, setDetailsLabel] = useState<string>("Details");
	const [paymentType, setPaymentType] = useState<string>("notPaid");

	const addPartialDataSet = () => {
		if (partialDataSets.length < 10) {
			setPartialDataSets((prev: PartialPaymentDataType[]) => [
				...prev,
				{ id: prev.length + 1, key: "", details: "", amount: 0 },
			]);
		}
	};

	const removePartialDataSet = (id: number) => {
		setPartialDataSets((prev) => prev.filter((set) => set.id !== id));
	};

	function handlePartialDataChange (
		id: number,
		field: "details" | "key",
		value: string,
	) {
		setPartialDataSets((prev) =>
			prev.map((set) =>
				set.id === id ? { ...set, [field]: value } : set
			)
		);
	}

	function handlePartialDataAmountChange (
		id: number,
		value: number,
	) {
		setPartialDataSets((prev) =>
			prev.map((set) =>
				set.id === id ? { ...set, amount: value } : set
			)
		);
	}

	const updatePaymentData = (data: TransactionFormData, transactionId: string, key: string, details: string, amount: number) => {
		const expenseRef = getDatabaseReference(`transaction/project/${projectName}/${transactionId}/data/${key}`);
		const paymentRef = getDatabaseReference(`transaction/project/${projectName}/${key}/data/${transactionId}`);
		const expenseData = {
			details: `${format(new Date(data.date), "dd.MM.yy")} ${data.title} - ${data.details}`,
			amount: amount,
		}
		const paymentData = {
			details: details,
			amount: amount,
		}
		update(expenseRef, paymentData)
			.catch((error) => console.error(`Payment Data in Expense Transaction: ${error.message}`))
		update(paymentRef, expenseData)
			.catch((error) => console.error(`Expense Data in Payment Transaction: ${error.message}`))
	}

	const updatePartialPaymentData = async(data: TransactionFormData, newKey: string) => {
		partialDataSets.forEach((partialDataSet) => {
			if (partialDataSet.key && partialDataSet.key !== "Select" && partialDataSet.details !== "Select") {
				updatePaymentData(data, newKey, partialDataSet.key, partialDataSet.details, partialDataSet.amount);
			}
		})
	}


	const handleTypeChange = (value:string) => {
		setValue('type', value);
		setValue('title', "Select");
		if (value === "-") setTitleLabel("Payment Type")
		else setTitleLabel("Expense Type")
	}

	const handleTitleChange = (label:string) => {
		switch (label) {
			case "Cash":
				setDetailsLabel("Receiver");
				setValue("details", "");
				break;
			case "Cheque":
			case "Bank Transfer":
				setDetailsLabel('Bank Name, Branch');
				setValue("details", "");
				break;
			case "Account Transfer":
			case "CellFin (Account)":
				setDetailsLabel('Account Number');
				setValue("details", "Acc No.**");
				break;
			case "CellFin (Phone)":
				setDetailsLabel('Phone Number');
				setValue("details", "");
				break;
			case "bKash":
				setDetailsLabel('bKash Number');
				setValue("details", "");
				break;
			case "Servicing":
				setDetailsLabel("Month");
				setValue("details", "");
				setValue("amount", servicingCharge ? servicingCharge : 0);
				break;
			case "Spare Parts":
				setDetailsLabel('Name of Parts');
				setValue("details", "");
				break;
			default:
				setDetailsLabel("Details");
				setValue("details", "");
				break;
		}
	}

	const onSubmit = async (data: TransactionFormData) => {
		if (data.type == "+" && paymentType == "full" && (!fullPaymentData || !fullPaymentData.key || fullPaymentData.details === "Select" || fullPaymentData.details === "")) {
			showToast("Error", "Please select a valid payment date", "destructive");
		} else {
			let paymentData = {}
			if (data.type === "+") {
				if (paymentType == "full") {
					paymentData = {
						[fullPaymentData.key] : {
							details: fullPaymentData.details,
							amount: data.amount,
						}
					}
				} else if (paymentType == "partial") {
					paymentData = partialDataSets.reduce((partialDataObject, partialData) => {
						if (partialData.key && partialData.key !== "Select" && partialData.details !== "Select") {
							partialDataObject[partialData.key] = {
								amount: partialData.amount,
								details: partialData.details,
							};
						}
						return partialDataObject;
					}, {} as { [key: string]: { amount: number; details: string } });
				}
			}

			const newKey: string = `${format(new Date(data.date), "yyMMdd")}${generateDatabaseKey(`transaction/project/${projectName}`)}`;
			await set(getDatabaseReference(`transaction/project/${projectName}/${newKey}`), {
				title: data.title,
				details: data.details,
				amount: data.type == "+" ? data.amount : data.amount * (-1),
				date: format(new Date(data.date), "dd.MM.yy"),
				data: paymentData,
			}).then(() => {
				if (paymentType === "full") {
					updatePaymentData(data, newKey, fullPaymentData.key, fullPaymentData.details, data.amount)
				} else if (paymentType === "partial") {
					updatePartialPaymentData(data, newKey)
						.catch((error) => {
							console.log(error);
							showToast("Error", "Failed to update payment data", "destructive");
						});
				}
				updateLastUpdateDate("project", projectName).catch((error) => {
					console.error(error.message());
					showToast(error.name, "Failed to update the last update date", "destructive");
				});
			}).finally(() => {
				setOpen(false);
				window.location.reload();
			});
		}
	}

	const handleUpdateBalance = () => {
		updateTransactionBalance("project", projectName, total).then(() => {
			showToast("Success", "Total balance updated successfully", "success");
		}).catch((error) => {
			showToast("Error", `Error updating total balance: ${error.message}`, "destructive");
		})
	}

	return (
		<Layout breadcrumb={breadcrumb}>
			<div className={"flex flex-col h-full"}>
				<div className="flex items-center pb-2 gap-x-2">
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<Button variant={"accent"}>
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
								<CustomRadioGroup id={'type'} options={projectTransactionOptions}
																	onChange={(value) => handleTypeChange(value)}
																	defaultValue={"+"}
								/>
								<CustomDropDown id="title"
																label={titleLabel}
																options={getValues("type") === "-" ? projectPaymentOptions : projectExpenseOptions}
																{...register('title')}
																helperText={errors.title ? errors.title.message : ""}
																color={errors.title ? "error" : "default"}
																onChange={(e) => handleTitleChange(e.target.options[e.target.selectedIndex].text)}
																required
								/>
								<CustomInput id="details"
														 type="text"
														 label={detailsLabel}
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
								<CustomInput id="date"
														 type="date"
														 label="Date"
														 helperText={errors.date ? errors.date.message : ""}
														 color={errors.date ? "error" : "default"}
														 {...register("date")}
														 required
								/>
								{paidDataOptions && getValues("type") === "+" &&
                  <div>
                    <CustomSeparator orientation={"horizontal"} className={"my-4"}/>
                    <CustomRadioGroup id={'paymentType'} options={projectPaymentTypeOptions}
                                      onChange={(value) => setPaymentType(value)}
                                      defaultValue={paymentType}
																			className="mb-4"
                    />
										{
											paymentType == "full" ?
												<CustomDropDown id="fullPaymentDate"
																				label="Payment Date"
																				options={paidDataOptions}
																				onChange={(e) => setFullPaymentData({key: e.target.value, details: e.target.options[e.target.selectedIndex].text})}
												/>
											: paymentType == "partial" ?
												<div className="text-center">
													{
														partialDataSets.length < 10 && (
															<Button variant="accent" size="lg" onClick={addPartialDataSet}>Add</Button>
														)
													}
													{
														partialDataSets.map((set, index) => (
															<div key={set.id} className={`flex gap-x-2`}>
																<CustomDropDown id={`paymentDate${index + 1}`} label={`Payment Date ${index + 1}`}
																								className={`flex-[1_1_73%]`} options={paidDataOptions}
																								onChange={(e) => {
																									handlePartialDataChange(set.id, "details", e.target.options[e.target.selectedIndex].text);
																									handlePartialDataChange(set.id, "key", e.target.value);
																								}}
																/>
																<CustomInput id={`paymentAmount${index + 1}`} label={`Amount ${index + 1}`}
																						 type="number" pre={`৳`} className={`flex-[1_1_27%]`}
																						 onChange={(e) => handlePartialDataAmountChange(set.id, Number(e.target.value))}
																/>
																<Button variant="destructive" className="mt-[18px]" size="icon" onClick={() => removePartialDataSet(set.id)}>
																	<MdDelete/>
																</Button>
															</div>
														))
													}
												</div>
											: null
										}
                  </div>
								}
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

					<Separator orientation={`vertical`}/>

					<div className="flex items-center gap-x-2">
						<span>Filter by</span>
						<CustomButtonGroup options={projectTransactionFilterOptions} onChange={(value) => setFilter(value)}/>
					</div>

					<Separator orientation={`vertical`}/>

					<Dialog>
						<DialogTrigger asChild>
							<Button variant={"accent"}>Transaction Colour Info</Button>
						</DialogTrigger>
						<DialogContent className={"border border-accent"}>
							<DialogHeader>
								<DialogTitle>Transaction Colour Info</DialogTitle>
								<DialogDescription>
									Read to know what each coloured transaction means.
								</DialogDescription>
							</DialogHeader>
							{
								Object.entries(transactionColourInfo).map(([key, value]) => (
									<div key={key}>
										<div className="capitalize underline font-semibold">{`${key} Transaction`}</div>
										<div className="mt-2 space-y-2">
											{
												Object.entries(value).map(([id, { colour, details }]) => (
													<div key={id} className={`text-sm p-1 bg-${colour} rounded-lg`}>{details}</div>
												))
											}
										</div>
									</div>
								))
							}
							<DialogFooter className={"sm:justify-center pt-8"}>
								<DialogClose asChild>
									<Button type="button" size="lg" variant="secondary">
										Close
									</Button>
								</DialogClose>
							</DialogFooter>
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
						: !data || !filteredData || data.length == 0 ?
							<CardIcon
								title={"No Record Found"}>
								<MdError size={28}/>
							</CardIcon>
						: <div className="space-y-2">
							{
								filteredData.sort((a, b) => b.id.localeCompare(a.id)).map((item) => {
									return (
										<div key={item.id}>
											<CardTransactionProject projectName={projectName} transactionId={item.id}
																							title={item.title} details={item.details}
																							amount={item.amount} date={item.date}
																							userAccess={userRole}
																							paidDataOptions={paidDataOptions}/>
										</div>
									)
								})
							}
						</div>
					}
				</ScrollArea>
				<div>
					{totalBalanceData &&
            <CardTotalBalance value={total}
															date={totalBalanceDate}
															onClick={handleUpdateBalance}
															update={total != totalBalanceValue}/>
					}
				</div>
			</div>
		</Layout>
	)
}