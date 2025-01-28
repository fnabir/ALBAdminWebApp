"use client"

import Layout from "@/components/layout";
import {useList, useListKeys} from "react-firebase-hooks/database";
import {useAuth} from "@/hooks/useAuth";
import {formatCurrency, getDatabaseReference} from "@/lib/utils";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {DataSnapshot} from "@firebase/database";
import {FaBook, FaBuildingUser, FaMoneyBillTransfer, FaTag, FaWrench} from "react-icons/fa6";
import Link from "next/link";
import {useRouter} from "next/navigation";
import Loading from "@/components/loading";
import React, {useEffect} from "react";
import CardIconVertical from "@/components/card/cardIconVertical";

export default function Page() {
  const { user, loading, userRole } = useAuth();
  const router = useRouter();

  const [dataTotalBalance, loadingTotalBalance, errorTotalBalance] = useList(getDatabaseReference('balance/total'));
  const [snapshotOffer, offerLoading] = useListKeys(getDatabaseReference('offer'));

  const breadcrumb: {text: string, link?: string}[] = [
    { text: "Home"},
  ]

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router])

  if (loading || offerLoading) return <Loading/>

  if (user) {
    return (
      <Layout breadcrumb={breadcrumb}>
        <div className="grid auto-rows-min gap-4">
          {
            loadingTotalBalance ?
              <div className="p-4 rounded-xl bg-muted/50">
                <Skeleton className="h-6 mb-2 w-1/5 rounded-xl"/>
                <Skeleton className="h-10 mb-1 w-1/2 rounded-xl"/>
                <Skeleton className="h-4 w-2/5 rounded-xl"/>
              </div>
            : errorTotalBalance ?
              <Card className="rounded-xl bg-muted/50">
                <CardHeader className={"pb-1"}>
                  <CardTitle className={"text-xl"}>{errorTotalBalance.name}</CardTitle>
                </CardHeader>
                <CardContent>{errorTotalBalance.message}</CardContent>
              </Card>
            : !dataTotalBalance ?
              <Card className="rounded-xl bg-muted/50">
                <CardHeader className={"pb-1"}>
                  <CardTitle className={"text-xl"}>No data found</CardTitle>
                </CardHeader>
              </Card>
            : <div className={`grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3`}>
              {
                dataTotalBalance.sort((a: DataSnapshot, b: DataSnapshot) => b.val().value - a.val().value).map((item, index) => (
                  <Link
                    className={(item.key != "project" && userRole != "admin") ? "hidden" : ""}
                    href={`/${item.key}`}
                    key={item.key}
                  >
                    <Card className={"rounded-xl bg-muted/50 hover:cursor-pointer hover:bg-muted/100 opacity-0 animate-fade-in-y"}
                          style={{ animationDelay: `${0.1 + index * 0.1}s`}}>
                      <CardHeader className={"pb-2"}>
                        <CardTitle className={"text font-medium capitalize"}>{item.key}</CardTitle>
                      </CardHeader>
                      <CardContent className={"pb-0 text-3xl text-primary font-bold font-mono"}>
                        {formatCurrency(item.val().value)}
                      </CardContent>
                      <CardFooter className={"text-md text-muted-foreground"}>
                        Last updated on {item.val().date}
                      </CardFooter>
                    </Card>
                  </Link>
                ))
              }
            </div>
          }
        </div>
        <div className="grid auto-rows-min gap-4 mt-4 md:grid-cols-3 xl:grid-cols-5">
          <CardIconVertical title={"Project Info"}
                            route={"/project-info"}
                            description={"Location, Contact"}
                            className={"opacity-0 animate-fade-in-y"}
                            animationDelay={0.15}>
            <FaBuildingUser size={48}/>
          </CardIconVertical>
          <CardIconVertical title={"Offer"}
                            number={snapshotOffer?.length}
                            route={"/offer"}
                            className={"opacity-0 animate-fade-in-y"}
                            animationDelay={0.3}>
            <FaTag size={48}/>
          </CardIconVertical>
          <CardIconVertical title={"Callback"}
                            route={"/callback"}
                            description={"Details, Status"}
                            className={"opacity-0 animate-fade-in-y"}
                            animationDelay={0.45}>
            <FaWrench size={48}/>
          </CardIconVertical>
          <CardIconVertical title={"Error Code"}
                            route={"/error-code"}
                            description={"NICE 3000"}
                            className={"opacity-0 animate-fade-in-y"}
                            animationDelay={0.6}>
            <FaBook size={48}/>
          </CardIconVertical>
          <CardIconVertical title={"Payment Info"}
                            route={"/payment-info"}
                            className={"opacity-0 animate-fade-in-y"}
                            animationDelay={0.75}>
            <FaMoneyBillTransfer size={48}/>
          </CardIconVertical>
        </div>
      </Layout>
    );
  }
}