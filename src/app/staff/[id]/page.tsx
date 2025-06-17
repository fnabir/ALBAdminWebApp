"use client"

import Layout from "@/components/layout";
import CardTotalBalance from "@/components/card/cardTotalBalance";
import {useList, useObject} from "react-firebase-hooks/database";
import {getDatabaseReference, getTotalValue, showToast} from "@/lib/utils";
import CardIcon from "@/components/card/cardIcon";
import {Skeleton} from "@/components/ui/skeleton";
import {MdError} from "react-icons/md";
import {useParams, useRouter} from "next/navigation";
import React, {useEffect, useMemo} from "react";
import {useAuth} from "@/hooks/useAuth";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import Loading from "@/components/loading";
import {updateTransactionBalance} from "@/lib/functions";
import { BreadcrumbInterface } from "@/lib/interfaces";
import AddStaffTransactionDialog from "@/components/transaction/AddStaffTransactionDialog";
import CardSection from "@/components/card/cardSection";
import { FaListUl } from "react-icons/fa6";
import { ScrollArea } from "@/components/ui/scrollArea";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { TransactionRow } from "@/components/transaction/TransactionRow";
import AccessDenied from "@/components/accessDenied";
import RowSkeleton from "@/components/generic/skeleton";
import TransactionSection from "@/components/transaction/TransactionSection";

export default function StaffTransactionPage() {
	const {user, userLoading, isAdmin} = useAuth();
	const router = useRouter();
	const {id} = useParams() as {id: string};
	const staffID: string = decodeURIComponent(id);
	const [staffData] = useObject(getDatabaseReference(`balance/conveyance/${staffID}`));
	const staffName = staffData?.val().name;

	const breadcrumb: BreadcrumbInterface[] = [
		{ label: "Home", href: "/" },
		{ label: "Staff", href: "/staff" },
		{ label: staffName },
	]

	const conveyanceValue: number = staffData ? staffData.val().value : 0;

	const [transactionData, transactionLoading, transactionError] = useList(
		user && !userLoading && isAdmin ? getDatabaseReference(`transaction/staff/${staffID}`) : null
	);

	const paymentData = useMemo(() => transactionData ? transactionData.filter((item) => {return item.val().amount < 0}) : [], [transactionData]);
	const billData = useMemo(() => transactionData ? transactionData.filter((item) => {return item.val().amount >= 0}) : [], [transactionData]);

	const [totalBalanceSnapshot, totalBalanceLoading, totalBalanceError] = useObject(
		user && !userLoading && isAdmin ? getDatabaseReference(`balance/staff/${staffID}`) : null
	);
	const totalBalanceData = totalBalanceSnapshot?.val();
  const totalBill = useMemo(() => {
		return billData ? getTotalValue(billData, "amount") : 0;
	}, [billData]);
  const totalPayment = useMemo(() => {
		return paymentData ? getTotalValue(paymentData, "amount") : 0;
	}, [paymentData]);
  const total = useMemo(() => {
		return (totalBill + totalPayment);
	}, [totalBill, totalPayment]);
	const totalBalanceValue = totalBalanceData?.value ?? 0;

	const handleUpdateTotalBalance = () => {
		updateTransactionBalance("staff", staffID, total).then(() => {
			showToast("Success", "Total balance updated successfully", "success");
		}).catch((error) => {
			showToast("Error", `Error updating total balance: ${error.message}`, "error");
		})
	}

	useEffect(() => {
		if (!userLoading && !user) router.push('/login');
	}, [user, userLoading, router]);

	if (userLoading) return <Loading />

	if (!user) return null;

	if (!isAdmin) return <AccessDenied />

	return (
		<Layout breadcrumb={breadcrumb}>
			<div className={"flex flex-col h-full space-y-2"}>
				<div className="flex items-center gap-x-2">
					<AddStaffTransactionDialog
						staffID={staffID}
					/>

					{!transactionLoading && !totalBalanceLoading && total != totalBalanceValue &&
						<div className={"flex gap-x-2 h-full"}>
							<Separator orientation={`vertical`}/>
							<Button variant="accent" onClick={handleUpdateTotalBalance}>
								Update Total Balance
							</Button>
						</div>
					}
				</div>
        <ScrollArea className={"grow mb-2 -mr-4 pr-4"}>
          <div className="grid grid-cols-2 gap-2 lg:gap-4">
            <TransactionSection title="Bill"
                                balance={totalBill}
                                className="border border-blue-600"
                                contentClassName="flex flex-col space-y-2"
                                backdropColor="bg-blue-500">
              {
                transactionLoading ?
                  <RowSkeleton repeat={6} className="h-10" />
                : transactionError ?
                  <CardIcon title={"Error"} description={transactionError.message}>
                    <MdError size={28}/>
                  </CardIcon>
                :!billData || billData.length == 0 ?
                  <CardIcon title={"No bill record found"}>
                    <MdError size={28}/>
                  </CardIcon>
                : billData.sort((a, b) => b.key!.localeCompare(a.key!)).map((item, index) => {
                  const val = item.val();
                  return (
                    <TransactionRow key={index}
                                    type="staff"
                                    id={staffID}
                                    transactionId={item.key!}
                                    title={val.title}
                                    details={val.details}
                                    value={val.amount}
                                    date={val.date}
                                    isAdmin={isAdmin}/>
                  )
                })
              }
            </TransactionSection>
            <TransactionSection title="Payment"
                                balance={Math.abs(totalPayment)}
                                className="border border-green-600"
                                contentClassName="flex flex-col space-y-2"
                                backdropColor="bg-green-500">
              {
                transactionLoading ?
                  <RowSkeleton repeat={4} className="h-10" />
                : transactionError ?
                  <CardIcon title={"Error"} description={transactionError.message}>
                    <MdError size={28}/>
                  </CardIcon>
                :!paymentData || paymentData.length == 0 ?
                  <CardIcon title={"No payment record found"}>
                    <MdError size={28}/>
                  </CardIcon>
                : paymentData.sort((a, b) => b.key!.localeCompare(a.key!)).map((item, index) => {
                  const val = item.val();
                  return (
                    <TransactionRow key={index}
                                    type="staff"
                                    id={staffID}
                                    transactionId={item.key!}
                                    title={val.title}
                                    details={val.details}
                                    value={val.amount}
                                    date={val.date}
                                    isAdmin={isAdmin}/>
                  )
                })
              }
            </TransactionSection>
          </div>
        </ScrollArea>
				
				{staffData &&
					<CardTotalBalance className={"mb-2"} text={"Conveyance Balance"} value={conveyanceValue}
														date={staffData?.val().date}/>}
				
				{totalBalanceData &&
            <CardTotalBalance value={total + conveyanceValue}
                              date={totalBalanceData.date}
                              error={totalBalanceError?.message}
                              onClick={handleUpdateTotalBalance}
                              update={total != totalBalanceValue}
                              className="opacity-0 animate-fade-in-y delay-300"/>
        }
			</div>
		</Layout>
	)
}