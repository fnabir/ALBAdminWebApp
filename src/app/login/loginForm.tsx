
import {auth} from "@/firebase/config";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {getDatabaseReference, showToast} from "@/lib/utils";
import React from "react";
import { ButtonLoading } from "@/components/generic/ButtonLoading";
import InputPassword from "@/components/generic/InputPassword";
import InputText from "@/components/generic/InputText";
import { FirebaseError } from "firebase/app";
import { LoginFormData, LoginFormSchema } from "@/lib/schemas";
import { login, logout } from "@/lib/functions";
import { get } from "firebase/database";
import { useRouter } from "next/navigation";

export default function LoginForm() {
	const router = useRouter();
	
	const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
  });

	const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      console.log('Logged in successfully');
      
      const user = auth.currentUser;
      
      if (!user) {
        showToast("Error", "No user found after login.", "error");
        return;
      }

      const snapshot = await get(getDatabaseReference(`info/user/${user.uid}/adminWebApp`));

      if (snapshot?.val() === true) {
        router.push("/");
      } else {
        await logout();
        showToast("Access Denied", "Not authorized to use this service", "error");
      }
    } catch (e) {
      const error = e as FirebaseError;
      console.log(error)
      switch (error.code) {
        case 'auth/invalid-email':
          showToast("Error", 'Invalid email address!', "error");
          break;
        case 'auth/user-not-found':
          showToast("Error", 'Email not registered with us!', "error");
          break;
        case 'auth/wrong-password':
          showToast("Error", 'Wrong password!', "error");
          break;
        case 'auth/network-request-failed':
          showToast("Error", 'Network connection issue!', "error");
          break;
        default:
          showToast("Error", 'Invalid email/password!', "error");
          break;
      }
    }
  };

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
			<InputText type={"email"}
									label={"Email"}
									floating={false}
									{...register('email')}
									placeholder="user@asianliftbd.com"
									error={errors.email?.message || ""}
									required
			/>
			<InputPassword label={"Password"}
										floating={false}
										{...register('password')}
										placeholder="******"
										error={errors.password?.message || ""}
										required
			/>
			<ButtonLoading
				type = "submit"
				loading = {isSubmitting}
				text = "Login"
				loadingText = "Logging in..."
			/>
		</form>
	)
}