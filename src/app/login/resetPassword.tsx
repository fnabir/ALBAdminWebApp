import {
	Drawer,
	DrawerClose, DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from "@/components/ui/drawer";
import {Button} from "@/components/ui/button";
import {useSendPasswordResetEmail} from "react-firebase-hooks/auth";
import {auth} from "@/firebase/config";
import {useForm} from "react-hook-form";
import {ForgotPasswordFormValues, forgotPasswordSchema} from "@/lib/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {showToast} from "@/lib/utils";
import CustomInput from "@/components/generic/CustomInput";
import React, {useEffect, useState} from "react";

export default function ResetPassword() {
	const [sendPasswordResetEmail, loading, error] = useSendPasswordResetEmail(auth);
	const [open, setOpen] = useState<boolean>(false);
	const [submit, setSubmit] = useState<boolean>(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgotPasswordFormValues>({
		resolver: zodResolver(forgotPasswordSchema),
	});

	const onSubmit = async (data: ForgotPasswordFormValues) => {
		await sendPasswordResetEmail(data.email).then(() => {
			setSubmit(true);
		})
	}

	useEffect(() => {
		if (submit && !loading) {
			if (error) {
				if (error.message === 'Firebase: Error (auth/user-not-found).') {
					showToast("Error", 'Email not registered with us!', "destructive");
				} else {
					showToast("Error", `"Error sending reset email: ${error.message}`, "destructive");
				}
			} else {
				setOpen(false);
				showToast("Sent", "Password reset mail sent successfully", "success");
			}
			setSubmit(false);
		}
	}, [submit, loading, error]);

	return (
		<div>
			<Drawer open={open} onOpenChange={setOpen}>
				<DrawerTrigger asChild>
					<Button variant="link">Forgot your password?</Button>
				</DrawerTrigger>
				<DrawerContent>
					<div className="mx-auto w-full max-w-sm">
						<DrawerHeader>
							<DrawerTitle className={"text-center"}>Reset Password</DrawerTitle>
							<DrawerDescription className={"text-center"}>Enter your registered mail with us to get the link to reset
								password</DrawerDescription>
						</DrawerHeader>
						<form onSubmit={handleSubmit(onSubmit)}>
							<CustomInput id={"email"}
													 type={"email"}
													 label={"Email"}
													 {...register('email')}
													 helperText={errors.email ? errors.email.message : ""}
													 color={errors.email ? "error" : "default"}
													 required
							/>
							<DrawerFooter>
								<Button type="submit" disabled={loading}>{loading ? "Sending..." : "Send Reset Password Link"}</Button>
								<DrawerClose asChild>
									<Button variant="outline">Cancel</Button>
								</DrawerClose>
							</DrawerFooter>
						</form>
					</div>
				</DrawerContent>
			</Drawer>
		</div>
)
}