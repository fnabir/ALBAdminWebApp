import { z } from 'zod';

export const LoginFormSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export type LoginFormData = z.infer<typeof LoginFormSchema>;

export const ForgotPasswordSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
});

export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

export const ChangePasswordSchema = z.object({
	currentPassword: z.string().nonempty("Current password is required"),
	newPassword: z.string().min(6, "New password must be at least 6 characters long"),
	confirmNewPassword: z.string().min(1, "Confirm new password is required"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
	message: "Passwords do not match",
	path: ["confirmNewPassword"],
});

export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

export const AccountFormSchema = z.object({
	name: z.string().nonempty("Full Name is required").min(4, "Name must be at least 4 characters long"),
	phone: z.string().optional(),
	title: z.string().optional(),
});

export type AccountFormData = z.infer<typeof AccountFormSchema>;

export const TransactionFormSchema = z.object({
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
});

export type TransactionFormData = z.infer<typeof TransactionFormSchema>;

export const OfferFormSchema = z.object({
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

export type OfferFormData = z.infer<typeof OfferFormSchema>;

export const CallbackFormSchema = z.object({
	project: z.string().nonempty("Project Name is required")
		.refine((val) => val != "Select", {message: "Choose Project"}),
	details: z.string().nonempty("Callback Details is required"),
	name: z.string().nonempty("Name is required"),
	date: z.string().nonempty("Date is required"),
	status: z.string().nonempty("Status is required")
		.refine((val) => val != "Select", {message: "Choose status"}),
});

export type CallbackFormData = z.infer<typeof CallbackFormSchema>;

export const PaymentInfoFormSchema = z.object({
	project: z.string().nonempty("Project Name is required")
		.refine((val) => val != "Select", {message: "Choose Project"}),
	type: z.string().nonempty("Type is required")
		.refine((val) => val != "Select", {message: "Choose payment info type"}),
	details: z.string().nonempty("Details is required"),
}).superRefine((data, ctx) => {
	const { type, details } = data; // Get both fields properly

	if (["account", "cellAccount", "bKash", "cell"].includes(type) && !/^\d+$/.test(details)) {
		ctx.addIssue({
			path: ["details"],
			code: z.ZodIssueCode.custom,
			message: "Details must be numbers only",
		});
	}

	if (["account", "cellAccount"].includes(type) && details.length !== 8) {
		ctx.addIssue({
			path: ["details"],
			code: z.ZodIssueCode.custom,
			message: "Input last 8 digits of the account number",
		});
	}

	if (["bKash", "cell"].includes(type) && details.length !== 11) {
		ctx.addIssue({
			path: ["details"],
			code: z.ZodIssueCode.custom,
			message: "Input the full 11 digits phone number",
		});
	}
});

export type PaymentInfoFormData = z.infer<typeof PaymentInfoFormSchema>;

export const EventFormSchema = z.object({
	title: z.string().nonempty("Title is required")
		.refine((val) => val != "Select", {message: "Choose event type"}),
	details: z.string().optional(),
	assigned: z.string().optional(),
	start: z.string().nonempty("Start Date/Time is required"),
	end: z.string().optional(),
	allDay: z.boolean(),
});

export type EventFormData = z.infer<typeof EventFormSchema>;