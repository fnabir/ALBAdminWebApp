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
import {updateTotalBalance} from "@/lib/functions";
import React, { useEffect, useMemo, useState } from "react";
import {Button} from "@/components/ui/button";
import { BreadcrumbInterface } from "@/lib/interfaces";
import { useFilteredSortedBalance } from "@/hooks/useFilteredSortedBalance";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import Loading from "@/components/loading";
import { StaffSortOptions } from "@/lib/arrays";
import CustomButtonGroup from "@/components/generic/CustomButtonGroup";
import NoAccess from "@/components/accessDenied";

const breadcrumb: BreadcrumbInterface[] = [
  { label: "Home", href: "/" },
  { label: "Conveyance" },
]

export default function ConveyancePage() {
  const {user, userLoading, isAdmin} = useAuth();
  const router = useRouter();

  const [sort, setSort] = useState<string>("position");

  const [balanceData, balanceLoading, balanceError] = useList(
    user && !userLoading ? getDatabaseReference("balance/conveyance") : null
  );
  const [totalBalanceSnapshot, totalBalanceLoading, totalBalanceError] = useObject(
    user && !userLoading ? getDatabaseReference("balance/total/conveyance") : null
  );
  
  const totalBalanceData = totalBalanceSnapshot?.val();
  const total = useMemo(() => {
    return getTotalValue(balanceData);
  }, [balanceData]);
  const totalBalanceValue = totalBalanceData?.value ?? 0;

  const data = useFilteredSortedBalance(balanceData, "none", sort);

	const handleUpdateTotalBalance = () => {
		updateTotalBalance("conveyance", total).then(() => {
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

  if (!isAdmin) return <NoAccess />

	return (
		<Layout breadcrumb={breadcrumb}>
			<div className={"flex flex-col h-full"}>
				<div className="flex items-center pb-2 gap-x-2">
          <div className="flex items-center gap-x-2">
						<span>Sort by</span>
						<CustomButtonGroup options={StaffSortOptions} value={sort} onChange={(value) => setSort(value)}/>
					</div>
          {!balanceLoading && !totalBalanceLoading && total != totalBalanceValue &&
            <div className={"flex gap-x-2 h-full"}>
              <Separator orientation={`vertical`}/>
              <Button variant="accent" onClick={handleUpdateTotalBalance}>
                Update Total Balance
              </Button>
            </div>
          }
        </div>
				<ScrollArea className={"grow -mr-4 pr-4 mb-2"}>
					{
						balanceLoading ?
              <div className="flex flex-col space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-full h-14 rounded-xl" />
                ))}
              </div>
							: balanceError ?
								<CardIcon
									title={"Error"}
									description={balanceError.message}>
									<MdError size={28}/>
								</CardIcon>
								: !data?.length ?
									<CardIcon
										title={"No Record Found"}>
										<MdError size={28}/>
									</CardIcon>
									: <div className={"flex flex-col space-y-2"}>
										{
											data.map((item: DataSnapshot, index) => {
                        const val = item.val();
                        return (
                          <CardBalance 
                            key={item.key!}
                            type={"conveyance"}
                            id={item.key!}
                            name={val.name} value={val.value}
                            date={val.date}
                            status={val.status}
                            animationDelay={index * 0.05}/>
                        )
											})
										}
									</div>
					}
				</ScrollArea>
				{totalBalanceData &&
            <CardTotalBalance value={total}
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