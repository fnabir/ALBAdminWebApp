"use client"

import Layout from "@/components/layout";
import {useList} from "react-firebase-hooks/database";
import {formatCurrency, getDatabaseReference} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scrollArea";
import CardIcon from "@/components/card/cardIcon";
import {Skeleton} from "@/components/ui/skeleton";
import {MdError} from "react-icons/md";
import React from "react";
import {projectInfo} from "@/lib/types";
import {DataTable} from "@/components/ui/dataTable";
import {ColumnDef} from "@tanstack/react-table";

export default function ProjectInfoPage() {
	const breadcrumb: {text: string, link?: string}[] = [
		{ text: "Home", link: "/" },
		{ text: "/" },
		{ text: "Project Info" },
	]

	const [projectData, projectLoading, projectError] = useList(getDatabaseReference("info/project"));
	const data: projectInfo[] = projectData
		? projectData.map((item) => ({
			...(item.val() as projectInfo),
			project: item.key!,
		}))
		: [];

	const columns: ColumnDef<projectInfo>[] = [
		{
			accessorKey: "project",
			header: () => ( <div className="text-center">Project Name</div> ),
			cell: ({ row }) => (
				<div className="text-center">
					{row.getValue("project")}
				</div> ),
		},
		{
			accessorKey: "location",
			header: () => ( <div className="text-center">Location</div> ),
			cell: ({ row }) => (
				<div className="text-center">
					{row.getValue("location")}
				</div> ),
		},

		{
			accessorKey: "phone",
			header: () => ( <div className="text-center">Phone Number</div> ),
			cell: ({ row }) => (
				<div className="text-center">
					{row.getValue("phone")}
				</div> ),
		},

		{
			accessorKey: "contactName",
			header: () => ( <div className="text-center">Name</div> ),
			cell: ({ row }) => (
				<div className="text-center">
					{row.getValue("contactName")}
				</div> ),
		},
		{
			accessorKey: "servicing",
			header: () => ( <div className="text-center">Servicing Charge</div> ),
			cell: ({ row }) => (
				<div className="text-center">
					{formatCurrency(row.getValue("servicing"))}
				</div> ),
		},
	]

	return (
		<Layout breadcrumb={breadcrumb}>
			<div className={"flex flex-col h-full"}>
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
						: <DataTable columns={columns} data={data} />
					}
				</ScrollArea>
			</div>
		</Layout>
	)
}