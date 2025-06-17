"use client"

import Layout from "@/components/layout";
import CardTotalBalance from "@/components/card/cardTotalBalance";
import {useList, useObject} from "react-firebase-hooks/database";
import {formatCurrency, getDatabaseReference, getTotalValue, showToast} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scrollArea";
import CardIcon from "@/components/card/cardIcon";
import {MdError} from "react-icons/md";
import {useParams, useRouter} from "next/navigation";
import React, {useEffect, useMemo, useRef} from "react";
import {useAuth} from "@/hooks/useAuth";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {ProjectTransactionInterface} from "@/lib/interfaces";
import {updateTransactionBalance} from "@/lib/functions";
import { BreadcrumbInterface } from "@/lib/interfaces";
import Loading from "@/components/loading";
import AddProjectTransactionDialog from "@/components/transaction/AddProjectTransactionDialog";
import TransactionColorInfoDialog from "@/components/transaction/TransactionColourInfoDialog";
import { ProjectTransactionRow } from "@/components/transaction/ProjectTransactionRow";
import TransactionSection from "@/components/transaction/TransactionSection";
import { useReactToPrint } from 'react-to-print';
import { FaPrint } from "react-icons/fa6";
import { format } from "date-fns";
import ProjectTransactionPrint from "./ProjectTransactionPrint";
import RowSkeleton from "@/components/generic/skeleton";

export default function ProjectTransactionPage() {
	const { user, userLoading, isAdmin } = useAuth();
  const router = useRouter();
  const {id} = useParams() as {id: string};
  const projectName = decodeURIComponent(id);

	const breadcrumb: BreadcrumbInterface[] = [
		{ label: "Home", href: "/" },
		{ label: "Project", href: "/project" },
		{ label: projectName },
	]

	const [ transactionData, dataLoading, dataError ] = useList(
    user && !userLoading ? getDatabaseReference(`transaction/project/${projectName}`) : null
  );

  const paymentData = useMemo(() => transactionData ? transactionData.filter((item) => {return item.val().amount < 0}) : [], [transactionData]);
  const billData = useMemo(() => transactionData ? transactionData.filter((item) => {return item.val().amount >= 0}) : [], [transactionData]);

  const [totalBalanceSnapshot, totalBalanceLoading, totalBalanceError] = useObject(
    user && !userLoading ? getDatabaseReference(`balance/project/${projectName}`) : null
  );
  
  const totalBalanceData = totalBalanceSnapshot?.val();
  const totalBill = useMemo(() => {
		return billData ? getTotalValue(billData, "amount") : 0;
	}, [billData]);
  const totalPayment = useMemo(() => {
		return paymentData ? getTotalValue(paymentData, "amount") : 0;
	}, [paymentData]);
  const total = useMemo(() => {
      return (totalBill + totalPayment);
    }, [totalBill, totalPayment]);
  const totalBalanceValue = totalBalanceData?.value ?? 0;

  const servicingCharge: number = useObject(getDatabaseReference(`info/project/${projectName}/servicing`))[0]?.val();
	const paidDataOptions = useMemo(() => transactionData?.filter(t=> t.val().amount < 0)
		.sort((a, b) => b.key!.localeCompare(a.key!))
		.map((item) => ({value: item.key!, label: `${item.val().date} ${item.val().title}: ${formatCurrency(Math.abs(item.val().amount))}`}))
  , [transactionData]);

	const handleUpdateBalance = () => {
		updateTransactionBalance("project", projectName, total).then(() => {
			showToast("Success", "Total balance updated successfully", "success");
		}).catch((error) => {
			showToast("Error", `Error updating total balance: ${error.message}`, "error");
		})
	};

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef, documentTitle: `${projectName}_${format(new Date(), "yyyyMMdd")}`});
  const handlePrint = () => {
    if (contentRef.current) reactToPrintFn();
  };

  useEffect(() => {
      if (!userLoading && !user) router.push('/login');
    }, [user, userLoading, router]);
  
    if (userLoading) return <Loading />
  
    if (!user) return null;

	return (
		<Layout breadcrumb={breadcrumb}>
			<div className={"flex flex-col h-full space-y-2"}>
				<div className="flex items-center gap-x-2 divide-x-2">
          <AddProjectTransactionDialog projectName={projectName} paidDataOptions={paidDataOptions} servicingCharge={servicingCharge}/>
          <TransactionColorInfoDialog/>
          {
            isAdmin && transactionData &&<Button variant="accent" onClick={handlePrint}>
              <FaPrint/> Print Statement
            </Button>
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
          <div className="grid grid-cols-2 gap-2 lg:gap-4">
            <TransactionSection title="Bill"
                                balance={totalBill}
                                className="border border-blue-600"
                                contentClassName="flex flex-col space-y-2"
                                backdropColor="bg-blue-500">
              {
                dataLoading ?
                  <RowSkeleton repeat={6} className="h-10" />
                : dataError ?
                  <CardIcon title={"Error"} description={dataError.message}>
                    <MdError size={28}/>
                  </CardIcon>
                :!paymentData || paymentData.length == 0 ?
                  <CardIcon title={"No payment record found"}>
                    <MdError size={28}/>
                  </CardIcon>
                : billData.sort((a, b) => b.key!.localeCompare(a.key!)).map((item, index) => {
                  return (
                    <ProjectTransactionRow key={index}
                                          projectName={projectName}
                                          transactionId={item.key!}
                                          transactionData={item.val() as ProjectTransactionInterface}
                                          servicingCharge={servicingCharge}
                                          paidDataOptions={paidDataOptions}
                                          isAdmin={isAdmin}/>
                  )
                })
              }
            </TransactionSection>
            <TransactionSection title="Payment"
                                balance={Math.abs(totalPayment)}
                                className="border border-green-600"
                                contentClassName="flex flex-col space-y-2"
                                backdropColor="bg-green-500">
              {
                dataLoading ?
                  <RowSkeleton repeat={4} className="h-10" />
                : dataError ?
                  <CardIcon title={"Error"} description={dataError.message}>
                    <MdError size={28}/>
                  </CardIcon>
                :!paymentData || paymentData.length == 0 ?
                  <CardIcon title={"No payment record found"}>
                    <MdError size={28}/>
                  </CardIcon>
                : paymentData.sort((a, b) => b.key!.localeCompare(a.key!)).map((item, index) => {
                  return (
                    <ProjectTransactionRow key={index}
                                          projectName={projectName}
                                          transactionId={item.key!}
                                          transactionData={item.val() as ProjectTransactionInterface}
                                          servicingCharge={servicingCharge}
                                          paidDataOptions={paidDataOptions}
                                          isAdmin={isAdmin}/>
                  )
                })
              }
            </TransactionSection>
          </div>
        </ScrollArea>
				{totalBalanceData &&
            <CardTotalBalance value={total}
                              date={totalBalanceData.date}
                              error={totalBalanceError?.message}
                              onClick={handleUpdateBalance}
                              update={total != totalBalanceValue}
                              className="opacity-0 animate-fade-in-y delay-300"/>
        }
      </div>
      <ProjectTransactionPrint
        ref={contentRef}
        projectName={projectName}
        transactionData={transactionData}
        total={total}
      />
		</Layout>
	)
}