"use client"

import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import TotalBalance from "@/components/TotalBalance";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import CardIcon from "@/components/card/CardIcon";
import {MdAddCircle, MdDownloading, MdError} from "react-icons/md";
import {GetDatabaseValue, GetObjectDataWithTotal, useGetObjectDataWithTotal} from "@/firebase/database";
import CardTransaction from "@/components/card/CardTransaction";
import AccessDenied from "@/components/AccessDenied";
import {Button, Modal} from "flowbite-react";
import CustomRadioGroup from "@/components/generic/CustomRadioGroup";
import CustomDropDown from "@/components/generic/CustomDropDown";
import CustomInput from "@/components/generic/CustomInput";
import {useState} from "react";
import {format, parse} from "date-fns";
import {errorMessage, successMessage} from "@/utils/functions";
import {child, push, ref, update} from "firebase/database";
import {database} from "@/firebase/config";
import {formatInTimeZone} from "date-fns-tz";

export default function StaffTransaction() {
	const {user, loading} = useAuth();
	const router = useRouter();
	const path = usePathname();

	const [newModal, setNewModal] = useState(false);
	const [transactionType, setTransactionType] = useState("+");
	const [inputTitle, setInputTitle] = useState("");
	const [inputDetails, setInputDetails] = useState("");
	const [inputAmount, setInputAmount] = useState(0);
	const [inputDate, setInputDate] = useState(format(new Date(), 'yyyy-MM-dd'));

	const options = [
		{ value: 'Advance', label: 'Advance' },
		{ value: 'For Conveyance', label: 'For Conveyance'},
		{ value: 'House Rent', label: 'House Rent' },
		{ value: 'Payment', label: 'Payment'},
		{ value: 'Salary', label: 'Salary'},
		{ value: 'Bonus', label: 'Bonus'},
		{ value: 'Cashback', label: 'Cashback'},
		{ value: 'Others', label: 'Others'},
	];

	const staffID: string = decodeURIComponent(path.substring(path.lastIndexOf("/") + 1));
	const staffName = GetDatabaseValue("balance/staff/" + staffID + "/name").data;
	const {dataExist, data, total, dataLoading, error} = useGetObjectDataWithTotal('transaction/staff/' + staffID);
	const totalBalanceValue = GetDatabaseValue(`balance/staff/${staffID}/value`).data;
	const totalBalanceDate = GetDatabaseValue(`balance/staff/${staffID}/date`).data;

	const handleTitleChange = (value: string, label:string) => {
		setInputTitle(value);
		switch (label) {
			case "Advance":
			case "For Conveyance":
			case "House Rent":
			case "Payment":
			case "Others":
				setInputDetails("");
				setTransactionType("-");
				break;
			case "Salary":
			case "Bonus":
			case "Cashback":
				setInputDetails("");
				setTransactionType("+");
				break;
			default:
				setTransactionType("-");
				setInputDetails("");
				break;
		}
	}

	const updateDate = async() => {
		const today = new Date();
		const todayTZ = formatInTimeZone(today, 'Asia/Dhaka', 'dd MMM yyyy');
		const formattedDate = format(todayTZ, "dd MMM yyyy")

		update(ref(database, `balance/total/staff`), {
			date: formattedDate,
		}).catch((error) => {
			console.error(error.message);
			errorMessage(error.message);
		})

		update(ref(database, `balance/staff/${staffID}`), {
			date: formattedDate,
		}).catch((error) => {
			console.error(error.message);
			errorMessage(error.message);
		})
	}

	const updateTotal = async() => {
		update(ref(database, `balance/staff/${staffID}`), {
			value: total,
		}).then(() => {
			successMessage("Total balance updated successfully!");
		}).catch((error) => {
			console.error(error.message);
			errorMessage(error.message);
		})
	}

	const handleNew = async () => {
		if (inputTitle == "Select") {
			errorMessage(`Please select ${transactionType} type`)
		}
		if (!inputDate) {
			errorMessage("Please select a valid date")
		}

		if(inputTitle != "Select" && inputDate) {
			const updatedData = {
				title: inputTitle,
				details: inputDetails,
				amount: transactionType == "Expense" ? inputAmount : inputAmount * (-1),
				date: format(parse(inputDate, "yyyy-MM-dd", new Date()), "dd.MM.yy")
			}
			const newKey = push(child(ref(database), `transaction/staff/${staffID}`)).key
			const newTransactionRef = `transaction/staff/${staffID}/${format(parse(inputDate, "yyyy-MM-dd", new Date()), "yyMMdd")}${newKey}`;
			update(ref(database, newTransactionRef), updatedData)
				.then(() => {
					// @ts-ignore
					data.join(updatedData);
					setNewModal(false);
					updateDate();
					successMessage("Saved the changes.")
					window.location.reload();
				})
				.catch((error) => {
					console.error(error.message);
					errorMessage(error.message);
				})
			successMessage("Saved the changes.")
		}
	};

	if (loading) return <Loading/>

	if (!loading && !user) return router.push("login");

	if (user.role == "admin") {
		return (
			<Layout
				pageTitle={staffName + " | Asian Lift Bangladesh"}
				headerTitle={staffName}>
				<div>
					<div className="flex items-center mt-2 gap-x-2">
						<Button color={"blue"} onClick={() => setNewModal(true)}>
							<MdAddCircle className="mr-2 h-5 w-5"/>Add New Transaction
						</Button>
					</div>

					<Modal show={newModal} size="md" popup onClose={() => setNewModal(false)} className="bg-black bg-opacity-50">
						<Modal.Header className="bg-slate-800 rounded-t-md text-white border-t border-x border-blue-500">
							<div className="text-xl font-medium text-white">New Transaction</div>
						</Modal.Header>
						<Modal.Body className="bg-slate-950 rounded-b-md border-b border-x border-blue-500">
							<div className="space-y-4 pt-4">
								<CustomDropDown id="title" label={"Type"} options={options}
																onChange={(value, label) => {
																	handleTitleChange(value, label)
																}}
								/>
								<CustomInput type="text" label="Details" id="details"
														 value={inputDetails}
														 onChange={(e) => setInputDetails(e.target.value)}
														 color={"default"} helperText={""}
								/>
								<CustomInput label="Amount" value={String(inputAmount)} type="number" id="amount"
														 pre={`৳ ${transactionType == "-" ? "-" : ""}`}
														 onChange={(e) => setInputAmount(Number(e.target.value))}
														 required
								/>
								<CustomInput label="Date" value={inputDate} type="date" id="date"
														 onChange={(e) => setInputDate(e.target.value)}
								/>

								<div className="flex gap-4 justify-center">
									<Button color="blue" onClick={handleNew}>Save</Button>
									<Button color="gray" onClick={() => setNewModal(false)}>Cancel</Button>
								</div>
							</div>
						</Modal.Body>
					</Modal>

					<div className="flex flex-col py-2 gap-y-2">
						{
							dataLoading ? (
								<CardIcon title={"Loading"} subtitle={"If data doesn't load in 30 seconds, please refresh the page."}>
									<MdDownloading className='mx-1 w-6 h-6 content-center'/>
								</CardIcon>
							) : error ? (
								<CardIcon title={"Error"} subtitle={error ? error : ""}>
									<MdError className='mx-1 w-6 h-6 content-center'/>
								</CardIcon>
							) : !dataExist ? (
								<CardIcon title={"No Record Found!"} subtitle={""}>
									<MdError className='mx-1 w-6 h-6 content-center'/>
								</CardIcon>
							) : (
								data.sort((a, b) => b.key.localeCompare(a.key)).map((item) =>
									(
										<div className="flex flex-col" key={item.key}>
											<CardTransaction type={"staff"} uid={staffID} transactionId={item.key}
																			 title={item.title} details={item.details}
																			 amount={item.amount} date={item.date} access={user.role}/>
										</div>
									)
								)
							)
						}
						<TotalBalance value={total} date={totalBalanceDate} update={total != totalBalanceValue} onClick={updateTotal}/>
					</div>
				</div>
			</Layout>
		);
	} else return <AccessDenied/>;
};