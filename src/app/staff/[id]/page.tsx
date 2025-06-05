"use client"

import Layout from "@/components/layout";
import CardTotalBalance from "@/components/card/cardTotalBalance";
import {useList, useObject} from "react-firebase-hooks/database";
import {getDatabaseReference, getTotalValue, showToast} from "@/lib/utils";
import CardIcon from "@/components/card/cardIcon";
import {Skeleton} from "@/components/ui/skeleton";
import {MdError} from "react-icons/md";
import {usePathname, useRouter} from "next/navigation";
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

export default function StaffTransactionPage() {
	const {user, userLoading, isAdmin} = useAuth();
	const router = useRouter();
	const path = usePathname();
	const staffID: string = decodeURIComponent(path.substring(path.lastIndexOf("/") + 1));
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
				<div className={"grow overflow-auto -mr-4 pr-4"}>
					{
						transactionLoading ?
							<div className="grid grid-cols-2 gap-2 lg:gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-10 rounded-lg" />
                ))}
              </div>
						: transactionError ? 
							<CardIcon
                title={"Error"}
                description={transactionError.message ?? "Error occurred retrieving transaction data."}>
                <MdError size={28}/>
              </CardIcon>
						: <div className="grid grid-cols-2 gap-2 lg:gap-6">
								<CardSection
									title="Bill"
									icon={FaListUl}
									iconColor="text-blue-500"
									backdropColor="bg-blue-500"
									className="col-span-2 xl:col-span-1"
									contentClassName="flex flex-col gap-2 lg:gap-4">
									<ScrollArea className="grow">
										{
                      !billData || billData.length == 0 ?
                        <CardIcon
                          title={"No Expense Record Found"}>
                          <MdError size={28}/>
                        </CardIcon>
                      : billData.map((item) => {
                        const val = item.val()
                        return (
                          <TransactionRow
                            key={item.key}
                            type="staff"
                            id={staffID}
                            transactionId={item.key!}
                            title={val.title}
                            details={val.details}
                            value={val.amount}
                            date={val.date}/>
                        )
                      })
                    }
									</ScrollArea>
                  <CardTotalBalance text="Total Bill" value={totalBill} />
								</CardSection>

								<CardSection
									title="Payment"
                  icon={FaRegMoneyBillAlt}
                  iconColor="text-green-500"
                  backdropColor="bg-green-500"
                  className="col-span-2 xl:col-span-1"
                  contentClassName="flex flex-col gap-2 lg:gap-4">
									<ScrollArea className="flex-1 overflow-auto">
										{
                      !paymentData || paymentData.length == 0 ?
                        <CardIcon
                          title={"No Payment Record Found"}>
                          <MdError size={28}/>
                        </CardIcon>
                      : paymentData.map((item) => {
                        const val = item.val()
                        return (
                          <TransactionRow
                            key={item.key}
                            type="staff"
                            id={staffID}
                            transactionId={item.key!}
                            title={val.title}
                            details={val.details}
                            value={val.amount}
                            date={val.date}/>
                        )
                      })
                    }
									</ScrollArea>
									<CardTotalBalance text="Total Bill" value={totalPayment} className="py-1!"/>
								</CardSection>
							</div>
					}
				</div>
				
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