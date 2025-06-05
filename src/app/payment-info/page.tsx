"use client"

import Layout from "@/components/layout";
import {useList} from "react-firebase-hooks/database";
import {getDatabaseReference} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scrollArea";
import CardIcon from "@/components/card/cardIcon";
import {Skeleton} from "@/components/ui/skeleton";
import {MdError} from "react-icons/md";
import React, {useEffect} from "react";
import {useAuth} from "@/hooks/useAuth";
import {useRouter} from "next/navigation";
import Loading from "@/components/loading";
import { BreadcrumbInterface } from "@/lib/interfaces";
import AddPaymentInfoDialog from "./add-payment-info-dialog";
import PaymentInfoGrid from "./payment-info-grid";

const breadcrumb: BreadcrumbInterface[] = [
  { label: "Home", href: "/" },
  { label: "Payment Info" },
]

export default function PaymentInfoPage() {
	const {user, userLoading, isAdmin} = useAuth();
	const router = useRouter();

	const [paymentData, paymentLoading, paymentError] = useList(getDatabaseReference("info/payment"));
  const accountPaymentData = paymentData?.find(snapshot => snapshot.key === "account");
  const bankPaymentData = paymentData?.find(snapshot => snapshot.key === "bank");
  const bkashPaymentData = paymentData?.find(snapshot => snapshot.key === "bKash");
  const cashPaymentData = paymentData?.find(snapshot => snapshot.key === "cash");
  const cellfinPaymentData = paymentData?.find(snapshot => snapshot.key === "cell");
  const chequePaymentData = paymentData?.find(snapshot => snapshot.key === "cheque");

	useEffect(() => {
    if (!userLoading && !user) router.push('/login');
  }, [user, userLoading, router]);

  if (userLoading) return <Loading />

  if (!user) return null;

	return (
		<Layout breadcrumb={breadcrumb}>
			<div className={"flex flex-col h-full space-y-2"}>
				<div className="flex items-center gap-x-2">
					<AddPaymentInfoDialog />
				</div>
				<ScrollArea className={"grow -mr-4 pr-4 mb-2"}>
					{
						paymentLoading ?
							<div className="grid gap-4 mt-4 md:grid-cols-3">
								<Skeleton className="w-full h-10 rounded-xl"/>
								<Skeleton className="w-full h-10 rounded-xl"/>
								<Skeleton className="w-full h-10 rounded-xl"/>
								<Skeleton className="w-full h-10 rounded-xl"/>
								<Skeleton className="w-full h-10 rounded-xl"/>
								<Skeleton className="w-full h-10 rounded-xl"/>
							</div>
						: paymentError ?
							<CardIcon
								title={"Error"}
								description={paymentError.message}>
								<MdError size={28}/>
							</CardIcon>
						: !paymentData || paymentData.length == 0 ?
							<CardIcon
								title={"No Record Found"}>
								<MdError size={28}/>
							</CardIcon>
						: <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                {
                  (cashPaymentData || bkashPaymentData || cellfinPaymentData) && <div className="grid gap-2 grid-cols-1">
                    {
                      cashPaymentData && <PaymentInfoGrid data={cashPaymentData} animationDelay={0.3} isAdmin={isAdmin}/>
                    }
                    {
                      bkashPaymentData && <PaymentInfoGrid data={bkashPaymentData} animationDelay={0.6} isAdmin={isAdmin}/>
                    }
                    {
                      cellfinPaymentData && <PaymentInfoGrid data={cellfinPaymentData} animationDelay={0.9} isAdmin={isAdmin}/>
                    }
                  </div>
                }
                {
                  (accountPaymentData || chequePaymentData) && <div className="grid gap-2 grid-cols-1">
                    {
                      accountPaymentData && <PaymentInfoGrid data={accountPaymentData} animationDelay={0.3} isAdmin={isAdmin}/>
                    }
                    {
                      chequePaymentData && <PaymentInfoGrid data={chequePaymentData} animationDelay={0.6} isAdmin={isAdmin}/>
                    }
                  </div>
                }
                {
                  bankPaymentData && <PaymentInfoGrid data={bankPaymentData} animationDelay={0.3} isAdmin={isAdmin}/>
                }
						</div>
					}
				</ScrollArea>
			</div>
		</Layout>
	)
}