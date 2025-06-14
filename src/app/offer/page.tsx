"use client"

import Layout from "@/components/layout"
import {ScrollArea} from "@/components/ui/scrollArea";
import CardIcon from "@/components/card/cardIcon";
import {MdError} from "react-icons/md";
import React, {useEffect, useMemo} from "react";
import {useList} from "react-firebase-hooks/database";
import {getDatabaseReference} from "@/lib/utils";
import {useAuth} from "@/hooks/useAuth";
import { BreadcrumbInterface } from "@/lib/interfaces";
import AddOfferDialog from "./add-offer-dialog";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import OfferRow from "@/app/offer/offer-row";
import RowSkeleton from "@/components/generic/skeleton";

const breadcrumb: BreadcrumbInterface[] = [
		{ label: "Home", href: "/" },
		{ label: "Offer" },
	];

export default function OfferPage() {
	const { user, userLoading, isAdmin } = useAuth();
  const router = useRouter();
	const [ data, dataLoading, dataError ] = useList(getDatabaseReference('offer'));

	const sortedData = useMemo(() => {
		if (!data) return [];
		return [...data].sort((a, b) => (b.key ?? "").localeCompare(a.key ?? ""));
	}, [data]);

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
							<RowSkeleton skeletonClassName="h-24"/>
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
								sortedData.map((item) => {
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