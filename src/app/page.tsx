"use client"

import Layout from "@/components/layout";
import {useList, useListKeys} from "react-firebase-hooks/database";
import {useAuth} from "@/hooks/useAuth";
import {formatCurrency, getDatabaseReference} from "@/lib/utils";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {DataSnapshot} from "@firebase/database";
import CardIcon from "@/components/card/cardIcon";
import {FaBuilding, FaTag, FaWrench} from "react-icons/fa6";
import Link from "next/link";

export default function Page() {
  const { userRole } = useAuth();

  const [dataTotalBalance, loadingTotalBalance, errorTotalBalance] = useList(getDatabaseReference('balance/total'));
  const [snapshotOffer] = useListKeys(getDatabaseReference('offer'));

  const breadcrumb: {text: string, link?: string}[] = [
    { text: "Home"},
  ]

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
                : <div className={`grid auto-rows-min gap-4 md:grid-cols-3`}>
                  {
                    dataTotalBalance.sort((a: DataSnapshot, b: DataSnapshot) => b.val().value - a.val().value).map((item) => (
                      <Link
                        className={(item.key != "project" && userRole != "admin") ? "hidden" : ""}
                        href={`/${item.key}`}
                        key={item.key}
                        >
                      <Card className={"rounded-xl bg-muted/50 hover:cursor-pointer hover:bg-muted/100"}>
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
      <div className="grid auto-rows-min gap-4 mt-4 md:grid-cols-3">
        <CardIcon
          title={"Project Info"}
          route={"/project-info"}
        >
          <FaBuilding size={24}/>
        </CardIcon>
        <CardIcon
          title={"Offer"}
          number={snapshotOffer?.length}
          route={"/offer"}
        >
          <FaTag size={24}/>
        </CardIcon>
        <CardIcon
          title={"Callback"}
          route={"/callback"}
        >
          <FaWrench size={24}/>
        </CardIcon>
      </div>
    </Layout>
);
}
