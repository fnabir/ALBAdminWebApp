"use client"

import Layout from "@/components/layout";
import CardTotalBalance from "@/components/card/cardTotalBalance";
import {useList, useObject} from "react-firebase-hooks/database";
import {getDatabaseReference, getTotalValue, showToast} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scrollArea";
import CardIcon from "@/components/card/cardIcon";
import {Skeleton} from "@/components/ui/skeleton";
import {MdError} from "react-icons/md";
import CardBalance from "@/components/card/cardBalance";
import {DataSnapshot} from "@firebase/database";
import {breadcrumbItem} from "@/lib/types";
import {updateTotalBalance} from "@/lib/functions";
import React from "react";
import {Button} from "@/components/ui/button";

export default function ConveyancePage() {
	const breadcrumb: breadcrumbItem[] = [
		{ text: "Home", link: "/" },
		{ text: "/" },
		{ text: "Conveyance" },
	]

	const [data, dataLoading, dataError] = useList(getDatabaseReference("balance/conveyance"))
	const [totalBalanceData, totalBalanceLoading] = useObject(getDatabaseReference("balance/total/conveyance"));
	const total: number = getTotalValue(data);
	const totalBalanceValue = totalBalanceData?.val().value;

	const handleUpdateTotalBalance = () => {
		updateTotalBalance("conveyance", total).then(() => {
			showToast("Success", "Total balance updated successfully", "success");
		}).catch((error) => {
			showToast("Error", `Error updating total balance: ${error.message}`, "destructive");
		})
	}

	return (
		<Layout breadcrumb={breadcrumb}>
			<div className={"flex flex-col h-full"}>
				{!dataLoading && !totalBalanceLoading && total != totalBalanceValue &&
          <div>
            <Button variant="accent" onClick={handleUpdateTotalBalance}>
              Update Total Balance
            </Button>
          </div>
				}
				<ScrollArea className={"grow mb-4 -mr-4 pr-4"}>
					{
						dataLoading ?
							<div className="p-4 rounded-xl bg-muted/100 flex items-center">
								<div className={"flex-auto"}>
									<Skeleton className="h-6 mb-1 w-1/2 rounded-xl"/>
									<Skeleton className="h-4 w-2/5 rounded-xl"/>
								</div>
								<Skeleton className="flex-wrap h-8 w-32 mr-4 rounded-xl"/>
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
									:
									data.sort((a: DataSnapshot, b: DataSnapshot) => (a.val().position - b.val().position)).map((item: DataSnapshot) => {
										const snapshot = item.val();
										return (
											<div className="flex-col my-2" key={item.key}>
												<CardBalance type={"conveyance"} id={item.key ? item.key : "undefined"} name={snapshot.name}
																		 value={snapshot.value} date={snapshot.date}
																		 status={snapshot.status}/>
											</div>
										)
									})
					}
				</ScrollArea>
				<div>
					{totalBalanceData &&
            <CardTotalBalance value={total}
                              date={totalBalanceData?.val().date}
                              onClick={handleUpdateTotalBalance}
                              update={total != totalBalanceValue}/>
					}
				</div>
			</div>
		</Layout>
	)
}