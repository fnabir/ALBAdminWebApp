import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const transactionSchema = z.object({
	type: z.string().nonempty("Transaction type is required"),
	title: z.string().nonempty("Title is required")
		.refine((val) => val != "Select", {message: "Choose transaction type"}),
	details: z.string().optional(),
	amount: z.number({
			required_error: "Number is required",
			invalid_type_error: "Input must be a number",
		}).nonnegative("Amount must be positive")
		.refine((val) => !isNaN(val), {
			message: "Input cannot be empty or not a number",
		}),
	date: z.string().nonempty("Date is required"),
}).refine((data) => data.type === "-" && data.amount !== 0, {
	message: "Payment amount cannot be 0",
	path: ["amount"],
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

export const offerSchema = z.object({
	name: z.string().nonempty("Name is required"),
	address: z.string().optional(),
	product: z.string().nonempty("Product type is required")
		.refine((val) => val != "Select", {message: "Choose product type"}),
	work: z.string().nonempty("Work type is required")
		.refine((val) => val != "Select", {message: "Choose work type"}),
	unit: z.string().optional(),
	floor: z.string().optional(),
	person: z.string().optional(),
	shaft: z.string().optional(),
	note: z.string().optional(),
	refer: z.string().optional(),
});

export type OfferFormData = z.infer<typeof offerSchema>;

export const callbackSchema = z.object({
	project: z.string().nonempty("Project Name is required")
		.refine((val) => val != "Select", {message: "Choose Project"}),
	details: z.string().nonempty("Callback Details is required"),
	name: z.string().nonempty("Name is required"),
	date: z.string().nonempty("Date is required"),
	status: z.string().nonempty("Status is required")
		.refine((val) => val != "Select", {message: "Choose status"}),
});

export type CallbackFormData = z.infer<typeof callbackSchema>;

export const eventSchema = z.object({
	title: z.string().nonempty("Title is required")
		.refine((val) => val != "Select", {message: "Choose event type"}),
	details: z.string().optional(),
	assigned: z.string().optional(),
	start: z.string().nonempty("Start Date/Time is required"),
	end: z.string().optional(),
	allDay: z.boolean(),
});

export type EventFormData = z.infer<typeof eventSchema>;

export const accountSchema = z.object({
	name: z.string().nonempty("Full Name is required").min(4, "Name must be at least 4 characters long"),
	email: z.string().optional(),
	phone: z.string().optional(),
	title: z.string().optional(),
	role: z.string().optional(),
});

export type AccountFormData = z.infer<typeof accountSchema>;

export const changePasswordSchema = z.object({
	currentPassword: z.string().nonempty("Current password is required"),
	newPassword: z.string().min(6, "New password must be at least 6 characters long"),
	confirmNewPassword: z.string().min(1, "Confirm new password is required"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
	message: "Passwords do not match",
	path: ["confirmNewPassword"],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;