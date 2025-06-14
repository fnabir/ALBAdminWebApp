import {remove, set, update} from "firebase/database";
import {generateDatabaseKey, getDatabaseReference, showToast} from "@/lib/utils";
import {format} from "date-fns";
import {formatInTimeZone} from "date-fns-tz";
import {signInWithEmailAndPassword, signOut} from "firebase/auth";
import {auth} from "@/firebase/config";
import {PaymentInfoFormData} from "@/lib/schemas";

export async function login(email: string, password: string) {
	return signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
	try {
		await signOut(auth)
		console.log("Logged out successfully.")
	} catch (error) {
		console.error("Error logging out: ", error)
	}
}

export async function updateTotalBalance(type: string, value: number) {
	await update(getDatabaseReference(`balance/total/${type}`), {
		value: value
	})
}

export async function updateTransactionBalance(type: string, id: string, value: number) {
	await update(getDatabaseReference(`balance/${type}/${id}`), {
		value: value
	})
}

export async function updateLastUpdateDate(type: string, id: string) {
		const today = new Date();
		const todayTZ = formatInTimeZone(today, 'Asia/Dhaka', 'dd MMM yyyy');
		const formattedDate = format(todayTZ, "dd MMM yyyy")

		await update(getDatabaseReference(`balance/total/${type}`), {
			date: formattedDate,
		}).catch((error) => {
			console.error(error.message);
			showToast(error.name, error.message, "error");
		})

		await update(getDatabaseReference(`balance/${type}/${id}`), {
			date: formattedDate,
		}).catch((error) => {
			console.error(error.message);
			showToast(error.name, error.message, "error");
		})
}

export async function addNewTransaction(type: string, id: string, date: string, data: object) {
	const newKey: string = `${format(new Date(date), "yyMMdd")}${generateDatabaseKey(`transaction/${type}/${id}`)}`;
	await set(getDatabaseReference(`transaction/${type}/${id}/${newKey}`), data).then(() => {
		showToast("Successful", "Submitted the new transaction successfully.", "success");
	}).catch ((error) => {
		showToast("Error", `Failed to save the new transaction: ${error.message}`, "error");
	})
}

export async function updateTransaction(type: string, id: string, transactionId: string, data: object) {
	await update(getDatabaseReference(`transaction/${type}/${id}/${transactionId}`), data).then(() => {
		updateLastUpdateDate(type, id).catch((error) => {
			console.error(error.message());
			showToast("Error", `Failed to update the last update date: ${error.message}`, "error");
		});
		showToast("Successful", "Updated the transaction successfully.", "success");
	}).catch ((error) => {
		showToast("Error", `Failed to update the transaction: ${error.message}`, "error");
	})
}

export async function deleteTransaction(type: string, id: string, transactionId: string, dataKeys?: string[]) {
	await remove(getDatabaseReference(`transaction/${type}/${id}/${transactionId}`)).then(() => {
		if (type == "project" && dataKeys) {
			dataKeys.forEach(async (key) => {
				remove(getDatabaseReference(`transaction/${type}/${id}/${key}/data/${transactionId}`))
					.catch((error) => console.error(error.message))
			})
		}
		showToast("Successful", "Deleted the transaction successfully.", "success");
	}).catch ((error) => {
		showToast(error.name, error.message, "error");
	})
}

export async function addNewOffer(data: object) {
	const newKey: string = `${format(new Date(), "yyMMdd")}${generateDatabaseKey(`offer`)}`;
	await set(getDatabaseReference(`offer/${newKey}`), data).then(() => {
		showToast("Successful", "Submitted the new offer successfully.", "success");
	}).catch ((error) => {
		showToast("Error", `Failed to save the new offer: ${error.message}`, "error");
	})
}

export async function updateOffer(id: string, data: object) {
	await update(getDatabaseReference(`offer/${id}`), data).then(() => {
		showToast("Successful", "Updated the offer successfully.", "success");
	}).catch ((error) => {
		showToast("Error", `Failed to update the offer: ${error.message}`, "error");
	})
}

export async function deleteOffer(id: string) {
	await remove(getDatabaseReference(`offer/${id}`)).then(() => {
		showToast("Successful", "Deleted the offer successfully.", "success");
	}).catch ((error) => {
		showToast("Error", `Failed to delete the offer: ${error.message}`, "error");
	})
}

export async function addNewCallback(projectName: string, date: string, data: object) {
	const newKey: string = `${format(new Date(date), "yyMMdd")}${generateDatabaseKey(`callback`)}`;
	await set(getDatabaseReference(`callback/${projectName}/${newKey}`), data).then(() => {
		showToast("Successful", "Submitted the new callback record successfully.", "success");
	}).catch ((error) => {
		showToast("Error", `Failed to save the new callback record: ${error.message}`, "error");
	})
}

export async function updateCallback(projectName: string, id: string, data: object) {
	await update(getDatabaseReference(`callback/${projectName}/${id}`), data).then(() => {
    window.location.reload();
		showToast("Successful", "Updated the callback record successfully.", "success");
	}).catch ((error) => {
		showToast("Error", `Failed to update the callback record: ${error.message}`, "error");
	})
}

export async function deleteCallback(projectName: string, id: string) {
	await remove(getDatabaseReference(`callback/${projectName}/${id}`)).then(() => {
		showToast("Successful", "Deleted the callback record successfully.", "success");
	}).catch ((error) => {
		showToast("Error", `Failed to delete the callback record: ${error.message}`, "error");
	})
}

export async function addNewPaymentInfo(data: PaymentInfoFormData) {
	await update(getDatabaseReference(`info/payment/${data.type === "cellAccount" ? "cell" : data.type}`), {
		[`${data.details}_${data.project}`]: data.project,
	}).then(() => {
		showToast("Successful", "Saved the new payment info successfully.", "success");
	}).catch ((error) => {
		showToast("Error", `Failed to save the new payment info: ${error.message}`, "error");
	})
}

export async function deletePaymentInfo(type:string, key: string) {
	await remove(getDatabaseReference(`info/payment/${type}/${key}`)).then(() => {
		showToast("Successful", "Deleted the payment info successfully.", "success");
	}).catch ((error) => {
		showToast("Error", `Failed to delete the payment info record: ${error.message}`, "error");
	})
}

export async function addNewEvent(date:string, data: object) {
	const newKey: string = `${format(new Date(date), "yyMMdd")}${generateDatabaseKey(`calendar`)}`;
	await set(getDatabaseReference(`calendar/${newKey}`), data).then(() => {
		showToast("Successful", "Saved the new event successfully.", "success");
	}).catch ((error) => {
		showToast("Error", `Failed to save the new event: ${error.message}`, "error");
	})
}

export async function updateEvent(id: string, data: object) {
	await update(getDatabaseReference(`calendar/${id}`), data).then(() => {
		showToast("Successful", "Updated the event details successfully.", "success");
	}).catch ((error) => {
		showToast("Error", `Failed to update the event details: ${error.message}`, "error");
	})
}

export async function deleteEvent(id: string) {
	await remove(getDatabaseReference(`calendar/${id}`)).then(() => {
		showToast("Successful", "Deleted the event successfully.", "success");
	}).catch ((error) => {
		showToast("Error", `Failed to delete the event record: ${error.message}`, "error");
	})
}

export async function updateAccountInfo(uid: string, data: object) {
	await update(getDatabaseReference(`info/user/${uid}`), data).then(() => {
		showToast("Successful", "Updated the account info successfully.", "success");
	}).catch ((error) => {
		showToast("Error", `Failed to update the account info record: ${error.message}`, "error");
	})
}