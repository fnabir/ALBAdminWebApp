"use client"

import Layout from "@/components/layout";
import {useAuth} from "@/hooks/useAuth";
import {useRouter} from "next/navigation";
import React, { useEffect } from "react";
import ChangePassword from "@/app/account-details/changePassword";
import { BreadcrumbInterface } from "@/lib/interfaces";
import Loading from "@/components/loading";
import AccountDetailsForm from "./accountDetailsForm";

const breadcrumb: BreadcrumbInterface[] = [
	{ label: "Home", href: "/" },
	{ label: "Account Details" },
]

export default function AccountPage() {
  const {user, userLoading} = useAuth();
	const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  if (userLoading) return <Loading />;

  if (!user) return null;

	return (
		<Layout breadcrumb={breadcrumb}>
			<div className={"flex flex-col h-full"}>
				<AccountDetailsForm />
				<ChangePassword/>
			</div>
		</Layout>
	)
}