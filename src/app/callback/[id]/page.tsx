"use client"

import Layout from "@/components/layout";
import {useParams, useRouter} from "next/navigation";
import {MdError} from "react-icons/md";
import {ScrollArea} from "@/components/ui/scrollArea";
import {Skeleton} from "@/components/ui/skeleton";
import CardIcon from "@/components/card/cardIcon";
import React, { useEffect } from "react";
import {getDatabaseReference} from "@/lib/utils";
import {useList} from "react-firebase-hooks/database";
import { BreadcrumbInterface } from "@/lib/interfaces";
import AddCallbackDialog from "./add-callback-dialog";
import CallbackRow from "./callback-row";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/loading";

export default function CallbackProjectPage() {
  const { user, userLoading, isAdmin } = useAuth();
  const router = useRouter();
  const {id} = useParams() as {id: string};
	const projectName = decodeURIComponent(id);

	const [ data, dataLoading, dataError ] = useList(getDatabaseReference(`callback/${projectName}`));
	const breadcrumb: BreadcrumbInterface[] = [
		{ label: "Home", href: "/" },
		{ label: "Callback", href: "/callback" },
		{ label: projectName },
	]

  useEffect(() => {
    if (!userLoading && !user) router.push('/login');
  }, [user, userLoading, router]);

  if (userLoading) return <Loading />

  if (!user) return null;

	return (
		<Layout breadcrumb={breadcrumb}>
			<div className={"flex flex-col h-full space-y-2"}>
				<div className="flex items-center gap-x-2">
					<AddCallbackDialog projectName={projectName}/>
				</div>
				<ScrollArea className={"grow mb-4 -mr-4 pr-4"}>
					{
						dataLoading ?
							<div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 rounded-xl bg-muted flex items-center space-x-2">
                    <Skeleton className="h-6 w-1/24 rounded-xl" />
                    <Skeleton className="h-6 w-1/2 rounded-xl grow" />
                    <Skeleton className="h-6 w-1/8 ml-4 rounded-xl" />
                    <Skeleton className="h-6 w-1/24 ml-4 rounded-xl" />
                  </div>
                ))}
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
                data.sort((a, b) => b.key!.localeCompare(a.key!)).map((item) => {
                  return (
                    <CallbackRow key={item.key}
                                projectName={projectName}
                                data={item}
                                isAdmin={isAdmin}
                    />
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