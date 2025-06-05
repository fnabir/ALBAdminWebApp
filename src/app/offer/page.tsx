"use client"

import Layout from "@/components/layout"
import {ScrollArea} from "@/components/ui/scrollArea";
import {Skeleton} from "@/components/ui/skeleton";
import CardIcon from "@/components/card/cardIcon";
import {MdError} from "react-icons/md";
import {DataSnapshot} from "@firebase/database";
import React, {useEffect} from "react";
import {useList} from "react-firebase-hooks/database";
import {getDatabaseReference} from "@/lib/utils";
import {useAuth} from "@/hooks/useAuth";
import { BreadcrumbInterface } from "@/lib/interfaces";
import AddOfferDialog from "./add-offer-dialog";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import OfferRow from "@/app/offer/offer-row";

const breadcrumb: BreadcrumbInterface[] = [
		{ label: "Home", href: "/" },
		{ label: "Offer" },
	];

export default function OfferPage() {
	const { user, userLoading, isAdmin } = useAuth();
  const router = useRouter();
	const [ data, dataLoading, dataError ] = useList(getDatabaseReference('offer'));

  useEffect(() => {
    if (!userLoading && !user) router.push('/login');
  }, [user, userLoading, router]);

  if (userLoading) return <Loading />

  if (!user) return null;

	return (
		<Layout breadcrumb={breadcrumb}>
			<div className={"flex flex-col h-full"}>
				<div className="flex items-center pb-2 gap-x-2">
					<AddOfferDialog userName={user?.displayName}/>
				</div>
				<ScrollArea className={"grow -mr-4 pr-4 mb-2"}>
					{
						dataLoading ?
							<div className="p-4 rounded-xl bg-muted/100 flex items-center">
								<Skeleton className="flex-wrap h-6 w-24 mr-4 rounded-xl"/>
								<div className={"flex-auto space-y-1"}>
									<Skeleton className="h-6 w-3/5 rounded-xl"/>
									<Skeleton className="h-4 w-1/3 rounded-xl"/>
									<Skeleton className="h-4 w-1/2 rounded-xl"/>
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
						: <div className={"space-y-2"}>
							{
								data.sort((a: DataSnapshot, b: DataSnapshot) => a.key!.localeCompare(b.key!)).map((item: DataSnapshot) => {
									return (
                    <OfferRow key={item.key} data={item} isAdmin={isAdmin}/>
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