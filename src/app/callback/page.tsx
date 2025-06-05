"use client"

import Layout from "@/components/layout"
import {getDatabaseReference} from "@/lib/utils";
import {useList} from "react-firebase-hooks/database";
import React from "react";
import {ScrollArea} from "@/components/ui/scrollArea";
import {Skeleton} from "@/components/ui/skeleton";
import {MdError} from "react-icons/md";
import CardIcon from "@/components/card/cardIcon";
import {DataSnapshot} from "@firebase/database";
import CardCallbackTotal from "@/components/card/cardCallbackTotal";
import { BreadcrumbInterface } from "@/lib/interfaces";
import AddCallbackDialog from "./[id]/add-callback-dialog";

const breadcrumb: BreadcrumbInterface[] = [
		{ label: "Home", href: "/" },
		{ label: "Callback" },
	]

export default function CallbackPage() {
	const [ data, dataLoading, dataError ] = useList(getDatabaseReference('callback'));

	return (
		<Layout breadcrumb={breadcrumb}>
			<div className={"flex flex-col h-full space-y-2"}>
				<div className="flex items-center gap-x-2">
					<AddCallbackDialog />
				</div>
				<ScrollArea className={"grow mb-4 -mr-4 pr-4"}>
					{
						dataLoading ?
							<div className="p-4 rounded-xl bg-muted/100 flex items-center">
								<div className={"flex-auto"}>
									<Skeleton className="h-6 mb-1 w-2/5 rounded-xl"/>
								</div>
								<Skeleton className="h-6 w-32 mr-4 rounded-xl"/>
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
						: <div className="space-y-2">
							{
								data.sort((a: DataSnapshot, b: DataSnapshot) => (a.val().position - b.val().position)).map((item: DataSnapshot) => {
									return (
										<div key={item.key}>
											<CardCallbackTotal name={item.key!} value={item.size} id={item.key!}/>
										</div>
									)
								})
							}
						</div>
					}
				</ScrollArea>
			</div>
		</Layout>
	)
}