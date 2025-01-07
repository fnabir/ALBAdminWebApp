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
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import CustomButtonGroup from "@/components/generic/CustomButtonGroup";
import {projectFilterOptions, projectSortOptions} from "@/lib/arrays";
import {updateTotalBalance} from "@/lib/functions";

export default function ProjectPage() {
	const [filter, setFilter] = useState('none');
	const [sort, setSort] = useState('name');
	const [data, setData] = useState<DataSnapshot[]>();
	const breadcrumb: {text: string, link?: string}[] = [
		{ text: "Home", link: "/" },
		{ text: "/" },
		{ text: "Project" },
	]

	const [projectData, projectLoading, projectError] = useList(getDatabaseReference("balance/project"))
	const [totalBalanceData, totalBalanceLoading] = useObject(getDatabaseReference("balance/total/project"))
	const total: number = getTotalValue(projectData)
	const totalBalanceValue = totalBalanceData?.val().value;

	useEffect(() => {
		if (projectData) {
			let filteredData = projectData;
			if (filter === "+") {
				filteredData = projectData.filter((t) => t.val().value > 0);
			} else if (filter === "0") {
				filteredData = projectData.filter((t) => t.val().value == 0);
			} else if (filter === "-") {
				filteredData = projectData.filter((t) => t.val().value < 0);
			} else if (filter === "x") {
				filteredData = projectData.filter((t) => t.val().status === "cancel");
			}
			setData((filteredData));
		}
	}, [projectData, filter]);

	const handleUpdateTotalBalance = () => {
		updateTotalBalance("project", total).then(() => {
			showToast("Success", "Total balance updated successfully", "success");
		}).catch((error) => {
			showToast("Error", `Error updating total balance: ${error.message}`, "destructive");
		})
	}

	return (
		<Layout breadcrumb={breadcrumb}>
			<div className={"flex flex-col h-full"}>
				<div className="flex items-center pb-2 gap-x-2">
					<div className="flex items-center gap-x-2">
						<span>Sort by</span>
						<CustomButtonGroup options={projectSortOptions} onChange={(value) => setSort(value)}/>
					</div>

					<Separator orientation={`vertical`}/>

					<div className="flex items-center gap-x-2">
						<span>Filter by</span>
						<CustomButtonGroup options={projectFilterOptions} onChange={(value) => setFilter(value)}/>
					</div>

					{!projectLoading && !totalBalanceLoading && total != totalBalanceValue &&
            <div className={"flex gap-x-2 h-full"}>
              <Separator orientation={`vertical`}/>
              <Button variant="accent" onClick={handleUpdateTotalBalance}>
                Update Total Balance
              </Button>
            </div>
					}
				</div>
				<ScrollArea className={"flex-grow -mr-4 pr-4 mb-2"}>
					{
						projectLoading ?
							<div className="p-4 rounded-xl bg-muted/100 flex items-center">
								<Skeleton className="flex-wrap h-10 w-10 mr-4 rounded-full"/>
								<div className={"flex-auto"}>
									<Skeleton className="h-6 mb-1 w-1/2 rounded-xl"/>
									<Skeleton className="h-4 w-2/5 rounded-xl"/>
								</div>
							</div>
							: projectError ?
								<CardIcon
									title={"Error"}
									description={projectError.message}>
									<MdError size={28}/>
								</CardIcon>
								: !projectData || !data || projectData.length == 0 ?
									<CardIcon
										title={"No Record Found"}>
										<MdError size={28}/>
									</CardIcon>
									: <div className={"space-y-2"}>
										{
											sort == "balance" ? data.sort((a: DataSnapshot, b: DataSnapshot) => (a.val().value - b.val().value)).map((item: DataSnapshot) => {
												const snapshot = item.val();
												return (
													<div key={item.key}>
														<CardBalance type={"project"} id={item.key ? item.key : "undefined"}
																				 name={item.key ? item.key : "undefined"} value={snapshot.value}
																				 date={snapshot.date}
																				 status={snapshot.status}/>
													</div>
												)
											}) : sort == "register" ? data.sort((a: DataSnapshot, b: DataSnapshot) => (a.val().register - b.val().register)).map((item: DataSnapshot) => {
												const snapshot = item.val();
												return (
													<div key={item.key}>
														<CardBalance type={"project"} id={item.key ? item.key : "undefined"}
																				 name={item.key ? item.key : "undefined"} value={snapshot.value}
																				 date={snapshot.date}
																				 status={snapshot.status}/>
													</div>
												)
											}) : data.sort((a: DataSnapshot, b: DataSnapshot) => a.key!.localeCompare(b.key!)).map((item: DataSnapshot) => {
												const snapshot = item.val();
												return (
													<div key={item.key}>
														<CardBalance type={"project"} id={item.key ? item.key : "undefined"}
																				 name={item.key ? item.key : "undefined"} value={snapshot.value}
																				 date={snapshot.date}
																				 status={snapshot.status}/>
													</div>
												)
											})
										}
									</div>
					}
				</ScrollArea>
				<div>
					{totalBalanceData &&
            <CardTotalBalance value={total}
                              date={totalBalanceData.val().date}
                              onClick={handleUpdateTotalBalance}
                              update={total != totalBalanceValue}/>
					}
				</div>
			</div>
		</Layout>
	)
}