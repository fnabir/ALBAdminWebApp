"use client"

import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {LoginFormValues, loginSchema} from "@/lib/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {auth} from "@/firebase/config";
import {showToast} from "@/lib/utils";
import Image from "next/image";
import TextLogo from "@/images/logo-text.svg";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import CustomInput from "@/components/generic/CustomInput";
import {Button} from "@/components/ui/button";
import ResetPassword from "@/app/login/resetPassword";
import {useState} from "react";
import {login, logout} from "@/lib/functions";

export default function LoginPage() {
  const router = useRouter();
  const [submit, setSubmit] = useState<boolean>(false);
  const access = ["HrnlOpNxfpTJ4JHjEE7E7lZXJ3n2", "STFXbv1ZzrbxDSWPCMpATVbOekh2", "WhAnZZh7CfNGhe1ejIUlAy1QAh33", "yB7jBuPIo7PxuhpliZ7VNnsL21l2", "LzcKIs2huyaK83FEOqbkJCumezu2"]

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setSubmit(true);
    try {
      await login(data.email, data.password);
      console.log('Logged in successfully');
      const user = auth.currentUser;
      if (access.includes(user!.uid)) {
        router.push("/");
      } else {
        logout().then(() => {
          showToast("Access Denied", "Not authorized to use this service", "destructive");
        })
          .catch((e: Error) => {
            console.error(e.message);
          })
      }
    } catch (e) {
      const error = e as Error;
      console.log(error.message);
      if (String(error.message) === 'Firebase: Error (auth/invalid-email).') {
        showToast("Error", 'Invalid email address!', "destructive");
      } else if (String(error.message) === 'Firebase: Error (auth/user-not-found).') {
        showToast("Error", 'Email not registered with us!', "destructive");
      } else if (String(error.message) === 'Firebase: Error (auth/wrong-password).') {
        showToast("Error", 'Wrong password!', "destructive");
      } else if (String(error.message) === 'Firebase: Error (auth/network-request-failed).') {
        showToast("Error", 'Network connection issue!', "destructive");
      } else {
        showToast("Error", 'Invalid email/password!', "destructive");
      }
    }
    setSubmit(false);
  };

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="relative md:py-3 max-w-full md:max-w-xl mx-auto">
        <div className="absolute inset-0 bg-linear-to-r from-blue-300 to-blue-600 shadow-lg transform md:-rotate-6 rounded-2xl"/>
        <Card className="w-full md:w-96 mx-auto bg-black/80 ring-1 ring-blue-800/5 shadow-black shadow-lg md:rounded-2xl backdrop-blur-2xl">
          <Image className={`w-2/3 pt-10 mx-auto`} src={TextLogo} alt={"Asian Lift Bangladesh"} priority={false}/>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
              <CustomInput id={"email"}
                           type={"email"}
                           label={"Email"}
                           floating={false}
                           {...register('email')}
                           placeholder="user@asianliftbd.com"
                           helperText={errors.email ? errors.email.message : ""}
                           color={errors.email ? "error" : "default"}
                           required
              />
              <CustomInput id={"password"}
                           type={"password"}
                           label={"Password"}
                           floating={false}
                           {...register('password')}
                           placeholder="******"
                           helperText={errors.password ? errors.password.message : ""}
                           color={errors.password ? "error" : "default"}
                           required
              />
              <Button type="submit" className="w-full" disabled={submit}>
                {submit ? "Logging in..." : "Login"}
              </Button>
            </form>
            <div className="text-center">
                  <ResetPassword/>
            </div>
            <div className="mt-4 text-center text-sm">
              <div>By logging in, you agree to our</div>
              <a className="underline" target="_blank" href="https://asianliftbd.com/terms-of-use"
                 rel="noopener noreferrer">
                Terms of Use
              </a> and {" "}
              <a className="underline" target="_blank" href="https://asianliftbd.com/privacy-policy"
                 rel="noopener noreferrer">
                Privacy Policy
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}