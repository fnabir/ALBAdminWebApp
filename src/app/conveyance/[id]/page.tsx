"use client"

import Layout from "@/components/layout";
import CardTotalBalance from "@/components/card/cardTotalBalance";
import {useList, useObject} from "react-firebase-hooks/database";
import {getDatabaseReference, getTotalValue, showToast} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scrollArea";
import CardIcon from "@/components/card/cardIcon";
import {Skeleton} from "@/components/ui/skeleton";
import {MdDelete, MdError} from "react-icons/md";
import {usePathname, useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import { useAuth } from "@/hooks/useAuth";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import CardTransaction from "@/components/card/cardTransaction";
import {updateLastUpdateDate, updateTransactionBalance} from "@/lib/functions";
import {remove} from "firebase/database";
import { BreadcrumbInterface } from "@/lib/interfaces";
import Loading from "@/components/loading";
import AccessDenied from "@/components/accessDenied";

export default function ConveyanceTransactionPage() {
	const {user, userLoading, isAdmin} = useAuth();
	const router = useRouter();
	const path = usePathname();
	const staffID: string = decodeURIComponent(path.substring(path.lastIndexOf("/") + 1));

	const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
	const [ data, dataLoading, dataError ] = useList(getDatabaseReference('transaction/conveyance/' + staffID));
	const total = getTotalValue(data, "amount");
	const [ totalBalanceData, totalBalanceLoading ] = useObject(getDatabaseReference(`balance/conveyance/${staffID}`));
	const staffName = totalBalanceData?.val().name;
	const totalBalanceValue: number = totalBalanceData ? totalBalanceData.val().value : 0;
	const totalBalanceDate = totalBalanceData?.val().date;

	const breadcrumb: BreadcrumbInterface[] = [
		{ label: "Home", href: "/" },
		{ label: "Conveyance", href: "/conveyance" },
		{ label: staffName },
	]

	const handleUpdateBalance = () => {
		updateTransactionBalance("staff", staffID, total).then(() => {
			showToast("Success", "Total balance updated successfully", "success");
		}).catch((error) => {
			showToast("Error", `Error updating total balance: ${error.message}`, "error");
		})
	}

	const handleDelete = () => {
		remove(getDatabaseReference('transaction/conveyance/' + staffID)).then(() => {
			updateLastUpdateDate("conveyance", staffID).catch((error) => {
				console.log(error);
			});
			showToast("Success", "All conveyance deleted successfully", "success");
		}).catch((error) => {
			showToast("Error", `Error deleting all conveyance: ${error.message}`, "error");
		}).finally(() => {
			setDeleteDialog(false);
			router.refresh();
		});
	}

	useEffect(() => {
		if (!userLoading && !user) router.push('/login');
	}, [user, userLoading, router]);

	if (userLoading) return <Loading />

	if (!user) return null;

  if (!isAdmin) return <AccessDenied />

	return (
		<Layout breadcrumb={breadcrumb}>
			<div className={"flex flex-col h-full"}>
				<div className="flex items-center py-2 gap-x-2">
					{!dataLoading && data && data.length > 0 &&
						<Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
							<DialogTrigger asChild>
								<Button variant={"accent"}>
									<MdDelete/> Clear All Conveyances
								</Button>
							</DialogTrigger>
							<DialogContent className={"border border-destructive"}>
								<DialogHeader>
									<DialogTitle>Clear All Conveyances</DialogTitle>
									<DialogDescription>
										This action cannot be undone. This will permanently delete all conveyances.
									</DialogDescription>
								</DialogHeader>
								<DialogFooter className={"mx-auto"}>
									<DialogClose asChild>
										<Button type="button" variant="secondary">
											Close
										</Button>
									</DialogClose>
									<Button variant="destructive" onClick={handleDelete}>Delete</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					}

					{!dataLoading && !totalBalanceLoading && total != totalBalanceValue &&
            <div className={"flex gap-x-2 h-full"}>
              <Separator orientation={`vertical`}/>
              <Button variant="accent" onClick={handleUpdateBalance}>
                Update Total Balance
              </Button>
            </div>
					}
				</div>
				<ScrollArea className={"grow mb-2 -mr-4 pr-4"}>
					{
						dataLoading ?
							<div className="p-4 rounded-xl bg-muted/100 flex items-center">
								<Skeleton className="flex-wrap h-10 w-10 mr-4 rounded-full"/>
								<div className={"flex-auto"}>
									<Skeleton className="h-6 mb-1 w-1/2 rounded-xl"/>
									<Skeleton className="h-4 w-2/5 rounded-xl"/>
								</div>
							</div>
						: dataError ?
							<CardIcon
								title={"Error"}
								description={dataError.message}>
								<MdError size={28}/>
							</CardIcon>
						: !data || data.length == 0 ?
							<CardIcon
								title={"No Record Found"}>
								<MdError size={28}/>
							</CardIcon>
						: data.sort((a, b) => b.key!.localeCompare(a.key!)).map((item) => {
							const snapshot = item.val();
							return (
								<div className="flex-col my-2" key={item.key}>
									<CardTransaction type={"staff"} uid={staffID} transactionId={item.key!}
																	 title={snapshot.title} details={snapshot.details}
																	 amount={snapshot.amount} date={snapshot.date}/>
								</div>
							)
						})
					}
				</ScrollArea>
				<div>
					{totalBalanceData &&
            <CardTotalBalance value={total}
                              date={totalBalanceDate}
                              onClick={handleUpdateBalance}
                              update={total != totalBalanceValue}/>
					}
				</div>
			</div>
		</Layout>
	)
}