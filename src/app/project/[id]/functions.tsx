import {GetDatabaseReference} from "@/firebase/database";
import {format, parse} from "date-fns";
import {remove, update} from "firebase/database";
import {formatInTimeZone} from "date-fns-tz";
import {errorMessage} from "@/utils/functions";

interface TransactionDataInterface {
	type: string,
	title: string,
	details?: string,
	amount: number,
	date: string,
	paymentType: string
}

interface FullPaymentDataInterface {
	key: string,
	details: string,
}

export const updateDate = async(projectName: string) => {
	const today = new Date();
	const todayTZ = formatInTimeZone(today, 'Asia/Dhaka', 'dd MMM yyyy');
	const formattedDate = format(todayTZ, "dd MMM yyyy")

	update(GetDatabaseReference(`balance/total/project`), {
		date: formattedDate,
	}).catch((error) => {
		console.error(error.message);
		errorMessage(error.message);
	})

	update(GetDatabaseReference(`balance/project/${projectName}`), {
		date: formattedDate,
	}).catch((error) => {
		console.error(error.message);
		errorMessage(error.message);
	})
}

export const updatePaymentData = async(projectName: string, transactionId: string, transactionData: TransactionDataInterface, key: string, details: string, amount: number) => {
	const expenseRef = GetDatabaseReference(`transaction/project/${projectName}/${transactionId}/data/${key}`);
	const paymentRef = GetDatabaseReference(`transaction/project/${projectName}/${key}/data/${transactionId}`);
	const expenseData = {
		details: `${format(parse(transactionData.date, "yyyy-MM-dd", new Date()), "dd.MM.yy")} ${transactionData.title} - ${transactionData.details}`,
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

export const updatePartialPaymentData = async(projectName: string, transactionId: string, transactionData: TransactionDataInterface, partialDataSets: any[]) => {
	partialDataSets.forEach((partialDataSet) => {
		if (partialDataSet.key && partialDataSet.key !== "Select" && partialDataSet.details !== "Select") {
			updatePaymentData(projectName, transactionId, transactionData, partialDataSet.key, partialDataSet.details, partialDataSet.amount);
		}
	})
}

export const paymentDataCleanup = async(projectName: string, transactionId: string, transactionData: TransactionDataInterface, fullPaymentData: FullPaymentDataInterface, partialDataSets: any[], dataKeys?: string[]) => {
	if (transactionData.type === "expense") {
		if (dataKeys) {
			if (transactionData.paymentType === "full") {
				dataKeys.filter((key) => key !== fullPaymentData.key)
					.forEach((key) => {
						remove(GetDatabaseReference(`project/${projectName}/${key}/data/${transactionId}`))
							.catch((error) => console.error(error.message))
					})
			} else if (transactionData.paymentType === "partial") {
				dataKeys.filter((key) => !partialDataSets.some((dataSet) => dataSet.key === key))
					.forEach((key) => {
						remove(GetDatabaseReference(`project/${projectName}/${key}/data/${transactionId}`))
							.catch((error) => console.error(error.message))
					})
			}
		}
	}
}