"use client"

import Image from "next/image";
import TextLogo from "@/images/logo-text.svg";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import ResetPassword from "@/app/login/resetPassword";
import LoginForm from "./loginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="relative md:py-3 w-full max-w-md mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform md:-rotate-6 rounded-2xl"/>
        <Card className="w-full mx-auto bg-black/80 ring-1 ring-blue-800/5 shadow-black shadow-lg md:rounded-2xl backdrop-blur-2xl text-center">
          <Image priority={false} className={`w-2/3 pt-10 mx-auto`} src={TextLogo} alt={"Asian Lift Bangladesh"}/>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <LoginForm />
            <ResetPassword/>
            <div className="mt-4 text-sm">
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