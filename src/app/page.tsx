"use client"

import Layout from "@/components/layout";
import {useList, useListKeys} from "react-firebase-hooks/database";
import {useAuth} from "@/hooks/useAuth";
import {formatCurrency, getDatabaseReference} from "@/lib/utils";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {DataSnapshot} from "@firebase/database";
import {FaBook, FaBuildingUser, FaRegEye, FaRegEyeSlash, FaTag, FaWrench, FaRegMoneyBill1} from "react-icons/fa6";
import Link from "next/link";
import {useRouter} from "next/navigation";
import Loading from "@/components/loading";
import React, {useEffect, useState} from "react";
import { IconType } from "react-icons";
import { Button } from "@/components/ui/button";
import { BreadcrumbInterface } from "@/lib/interfaces";
import ChangelogSection from "./changelog-section";

const breadcrumb: BreadcrumbInterface[] = [
  { label: "Home"},
]

export default function Page() {
  const { user, userLoading, isAdmin } = useAuth();
  const router = useRouter();

  const [dataTotalBalance, loadingTotalBalance] = useList(getDatabaseReference('balance/total'));
  const [snapshotOffer, offerLoading] = useListKeys(getDatabaseReference('offer'));

  const getInitialShowBalance = () => {
    if (typeof window !== 'undefined') {
      const storedShowBalance = localStorage.getItem('showBalance');
      return storedShowBalance !== null ? storedShowBalance === 'true' : true;
    }
    return true;
  };

  const [showBalance, setShowBalance] = useState<boolean>(getInitialShowBalance);
  
  const toggleShowBalance = () => {
    setShowBalance(prev => {
      const newValue = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('showBalance', String(newValue));
      }
      return newValue;
    });
	};

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);
  
  if (userLoading) return <Loading/>

  if (!user) return null;

  return (
    <Layout breadcrumb={breadcrumb}>
      <div className="grid grid-cols-12 gap-2 lg:gap-6">
        
        <div className="col-span-12 lg:col-span-9 gap-2 lg:gap-6">
          
          <Card className="backdrop-blur-sm overflow-hidden">
            <div className="-z-1 absolute -top-5 -right-5 size-30 rounded-full opacity-40 blur-2xl bg-cyan-500"/>
            <CardHeader className="flex items-center border-b-2 border-primary/20 pb-3">
              <CardTitle className="text-2xl font-bold w-full flex items-center justify-center space-x-2">
                  <div>Balance</div>
                  <div className='grow'>
                    <Button variant="outline"
                        size="icon"
                        onClick={toggleShowBalance} 
                    >
                      {showBalance ? 
                        <FaRegEye className="size-5"/>
                        : <FaRegEyeSlash className="size-5"/>
                      }
                      <span className="sr-only">Toggle Show Balance</span>
                    </Button>
                  </div>
                  <FaRegMoneyBill1 className="size-7 text-cyan-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 lg:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {
                  dataTotalBalance?.sort((a: DataSnapshot, b: DataSnapshot) => b.val().value - a.val().value).map((item, index) => 
                    (item.key === "project" || (item.key !== "project" && isAdmin)) &&
                    <BalanceCard key={item.key} data={item} href={item.key!} loading={loadingTotalBalance} showBalance={showBalance} index={index+1}/>
                  )
                }
              </div>
            </CardContent>
          </Card>
        
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
            <IconCard
              href="/project-info"
              icon={FaBuildingUser}
              title="Project Info"
              details="Location, Contact"
              index={1}
              loading={false}/>
            <IconCard
              href="/offer"
              count={snapshotOffer?.length ?? 0}
              title="Offer"
              details="Location, Contact"
              index={1}
              loading={offerLoading}/>
            <IconCard
              href="/callback"
              icon={FaWrench}
              title="Callback"
              details="Details, Status"
              index={1}
              loading={false}/>
            <IconCard
              href="/error-code"
              icon={FaBook}
              title="Error Code"
              details="NICE 3000"
              index={1}
              loading={false}/>
            <IconCard
              href="/payment-info"
              icon={FaTag}
              title="Payment Info"
              index={1}
              loading={false}/>
          </div>

        </div>

        <div className="col-span-12 lg:col-span-3 pb-6 space-y-2">

          <ChangelogSection isAdmin={isAdmin}/>
          
        </div>
      </div>
    </Layout>
  );
}

function IconCard({ href, icon: Icon, count, loading, index, title, details} :
  { href: string; icon?: IconType; count?: number, loading: boolean; title: string, details?: string, index: number}) {
  return (
    loading ? <Skeleton className="h-full rounded-xl"/>
    : <Link className={`p-2 lg:p-6 bg-card rounded-xl hover:bg-muted/50 border overflow-hidden flex flex-col items-center justify-center`} 
            href={href}
            style={{ animationDelay: `${0.1 + index * 0.1}s`}}>
              {Icon && <Icon className="size-8 lg:size-12"/>}
              {count && <div className={"font-semibold text-primary-foreground text-2xl bg-primary leading-[48px] size-[48px] rounded-full text-center"}>
								{count}
							</div>}
            <div className={"text-xl font-bold space-x-2 mt-1"}>{title}</div>
				    {details && <div className={`text-sm text-muted-foreground pb-0`}>{details}</div>
				}
      </Link>
  )
}

function BalanceCard({ data, href, icon: Icon, loading, showBalance, index} :
  { data: DataSnapshot | undefined; href: string; icon?: IconType; loading: boolean; showBalance: boolean, index: number}) {
  const snapshot = data?.val()
  return (
    loading ? <Skeleton className="min-h-30 rounded-xl"/>
    : data ?
      <Link className={`bg-secondary/20 rounded-xl border border-cyan-700 p-4 relative overflow-hidden hover:bg-secondary ${index ? "opacity-0 animate-fade-in-y" : ""}`} 
            href={href}
            style={{ animationDelay: `${0.1 + index * 0.1}s`}}>
        <div className="capitalize">{href}</div>
        <div className="text-3xl font-bold mb-1">{showBalance ? formatCurrency(snapshot?.value) : "---"}</div>
        {snapshot?.date && <div className="text-sm text-muted-foreground">{showBalance ? `Last updated on ${snapshot.date}` : "--------"}</div>}
        { Icon && <div className="absolute top-4 right-4 flex items-center">
          <Icon className={`size-6 text-cyan-600 dark:text-cyan-400`} />
        </div>}
        <div className="absolute -top-6 -right-6 size-20 rounded-full bg-gradient-to-r opacity-40 blur-2xl from-cyan-500 to-blue-500"/>
      </Link>
    : null
  )
}