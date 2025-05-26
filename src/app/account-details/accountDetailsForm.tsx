import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {getDatabaseReference, showToast} from "@/lib/utils";
import React from "react";
import { ButtonLoading } from "@/components/generic/ButtonLoading";
import InputText from "@/components/generic/InputText";
import { AccountFormData, AccountFormSchema } from "@/lib/schemas";
import { updateAccountInfo } from "@/lib/functions";
import { useAuth } from "@/hooks/useAuth";
import { useObject } from "react-firebase-hooks/database";
import { useUpdateProfile } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";

export default function AccountDetailsForm() {
	const {user} = useAuth();

  const [updateProfile] = useUpdateProfile(auth);
  const [userInfoData] = useObject(getDatabaseReference(`info/user/${user?.uid}`));
  const userInfo = userInfoData?.val();
	
	const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormData>({
    resolver: zodResolver(AccountFormSchema),
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
					showToast("Error", "Failed to update user display name.", "error");
				}
			}
		})
	};

  if (user) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm mx-auto mt-5 items-center">
        <InputText id={"name"}
                    type={"text"}
                    label={"Full Name"}
                    defaultValue={user.displayName || ""}
                    {...register("name")}
                    error={errors.name?.message || ""}
                    required
        />
        <InputText id={"email"}
                    type={"email"}
                    label={"Email"}
                    defaultValue={user.email || ""}
                    readOnly
        />
        <InputText id={"title"}
                    type={"text"}
                    label={"Title"}
                    defaultValue={userInfo?.title || ""}
                    readOnly
        />
        <InputText id={"phone"}
                    type={"tel"}
                    label={"Phone Number"}
                    defaultValue={userInfo?.phone || ""}
                    {...register("phone")}
                    error={errors.phone?.message || ""}
        />
        <ButtonLoading
            type="submit"
            loading = {isSubmitting}
            text = "Update"
            loadingText = "Updating..."
            className="w-full mt-5"/>
      </form>
    )
  }
}