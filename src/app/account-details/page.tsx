"use client"

import Layout from "@/components/layout";
import {useObject} from "react-firebase-hooks/database";
import {getDatabaseReference, showToast} from "@/lib/utils";
import {useAuth} from "@/hooks/useAuth";
import {useRouter} from "next/navigation";
import CustomInput from "@/components/generic/CustomInput";
import {useForm} from "react-hook-form";
import {AccountFormData, accountSchema} from "@/lib/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import LoadingWithTimer from "@/components/loadingWithTimer";
import {Button} from "@/components/ui/button";
import React from "react";
import {useUpdateProfile} from "react-firebase-hooks/auth";
import {auth} from "@/firebase/config";
import {updateAccountInfo} from "@/lib/functions";
import ChangePassword from "@/app/account-details/changePassword";

export default function AccountPage() {
	const {user, loading} = useAuth();
	const router = useRouter();
	const breadcrumb: {text: string, link?: string}[] = [
		{ text: "Home", link: "/" },
		{ text: "/" },
		{ text: "Account Details" },
	]

	const [updateProfile] = useUpdateProfile(auth);
	const [userInfoData, userInfoLoading] = useObject(getDatabaseReference(`info/user/${user?.uid}`));

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AccountFormData>({
		resolver: zodResolver(accountSchema),
	});

	const onSubmit = async (data: AccountFormData) => {
		updateAccountInfo(user!.uid, {
			name: data.name,
			phone: data.phone,
		}).then(async () => {
			if (data.name != user?.displayName) {
				const success = await updateProfile({displayName: data.name});
				if (success) {
					showToast("Success", "Updated user display name successfully.", "success");
				} else {
					showToast("Error", "Failed to update user display name.", "destructive");
				}
			}
		})
	};

	if (loading || userInfoLoading) return <LoadingWithTimer />;

	if (!loading && !user) {
		router.push("/login");
		return null;
	}

	return (
		<Layout breadcrumb={breadcrumb}>
			<div className={"flex flex-col h-full"}>
				<form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm mx-auto mt-5 items-center">
					<CustomInput id={"name"}
											 type={"text"}
											 label={"Full Name"}
											 defaultValue={user ? user.displayName! : undefined}
											 {...register("name")}
					/>
					<CustomInput id={"email"}
											 type={"email"}
											 label={"Email"}
											 defaultValue={user ? user.email! : undefined}
											 readOnly={true}
					/>
					<CustomInput id={"title"}
											 type={"text"}
											 label={"Title"}
											 defaultValue={userInfoData?.val().title}
											 readOnly={true}
					/>
					<CustomInput id={"phone"}
											 type={"tel"}
											 label={"Phone Number"}
											 defaultValue={userInfoData?.val().phone}
											 helperText={errors.phone ? errors.phone.message : ""}
											 color={errors.phone ? "error" : "default"}
											 {...register("phone")}
					/>
					<Button type="submit" variant="accent" className="w-full mt-5">Update</Button>
				</form>
				<ChangePassword/>
			</div>
		</Layout>
	)
}