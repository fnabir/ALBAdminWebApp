"use client"

import Layout from "@/components/layout";
import CardTotalBalance from "@/components/card/cardTotalBalance";
import {useList, useObject} from "react-firebase-hooks/database";
import {getDatabaseReference, getTotalValue, showToast} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scrollArea";
import CardIcon from "@/components/card/cardIcon";
import {MdError} from "react-icons/md";
import CardBalance from "@/components/card/cardBalance";
import {DataSnapshot} from "@firebase/database";
import {useEffect, useMemo, useState} from "react";
import {Button} from "@/components/ui/button";
import {updateTotalBalance} from "@/lib/functions";
import {useAuth} from "@/hooks/useAuth";
import Loading from "@/components/loading";
import {useRouter} from "next/navigation";
import { BreadcrumbInterface } from "@/lib/interfaces";
import { useFilteredSortedBalance } from "@/hooks/useFilteredSortedBalance";
import { ProjectFilterOptions, ProjectSortOptions } from "@/lib/arrays";
import RowSkeleton from "@/components/generic/skeleton";
import { ButtonGroup } from "@/components/generic/ButtonGroup";

	const breadcrumb: BreadcrumbInterface[] = [
		{ label: "Home", href: "/" },
		{ label: "Project" },
	]

export default function ProjectPage() {
	const {user, userLoading} = useAuth();
	const router = useRouter();

	const [filter, setFilter] = useState<string>("none");
	const [sort, setSort] = useState<string>("name");

  const [balanceData, balanceLoading, balanceError] = useList(
    user && !userLoading ? getDatabaseReference("balance/project") : null
  );
	const [totalBalanceSnapshot, totalBalanceLoading, totalBalanceError] = useObject(
    user && !userLoading ? getDatabaseReference("balance/total/project") : null
  );
  
  const totalBalanceData = totalBalanceSnapshot?.val();
  const total = useMemo(() => {
    return getTotalValue(balanceData);
  }, [balanceData]);
	const totalBalanceValue = totalBalanceData?.value ?? 0;

  const data = useFilteredSortedBalance(balanceData, filter, sort);

	const handleUpdateTotalBalance = () => {
		updateTotalBalance("project", total).then(() => {
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

	return (
		<Layout breadcrumb={breadcrumb}>
			<div className={"h-full flex flex-col space-y-2"}>
				<div className="flex flex-wrap items-center space-x-2 divide-x-2 divide-muted-foreground">
					<ButtonGroup title="Sort" options={ProjectSortOptions} value={sort} onChange={setSort} className="hidden"/>
					<ButtonGroup title="Filter" options={ProjectFilterOptions} value={filter} onChange={setFilter} className="hidden"/>
					{!balanceLoading && !totalBalanceLoading && total != totalBalanceValue &&
            <Button variant="accent" onClick={handleUpdateTotalBalance}>
							Update Total Balance
						</Button>
					}
				</div>
				<ScrollArea className={"grow -mr-4 pr-4 mb-2"}>
					{
						balanceLoading ?
							<RowSkeleton />
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
                      type={"project"}
                      id={item.key!}
                      name={item.key!} value={val.value}
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