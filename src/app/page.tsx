"use client"

import CardBalance from "@/components/card/CardTotalBalance";
import {MdErrorOutline, MdOutlineLocalOffer} from "react-icons/md";
import CardIcon from "@/components/card/CardIcon";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import {GetDatabaseReference} from "@/firebase/database";
import { useList } from 'react-firebase-hooks/database';
import UniqueChildren from "@/components/UniqueChildrenWrapper";
import {HiOutlineWrenchScrewdriver} from "react-icons/hi2";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [dataTotalBalance, loadingTotalBalance, errorTotalBalance] = useList(GetDatabaseReference('balance/total'));
  const [snapshotOffer] = useList(GetDatabaseReference('-offer'));

  if (loading) return <Loading/>

  if (!user) return router.push("login")

  return (
    <Layout
      pageTitle="Asian Lift Bangladesh"
      headerTitle="Dashboard">
      <div>
        <div className={(user.role == "admin" || user.role == "manager") ? 'flex flex-col md:flex-row justify-around space-x-0 md:space-x-2 space-y-2 md:space-y-0 mt-3' : "hidden"}>
            {
              loadingTotalBalance ? (
                <CardBalance title={"Loading"} balance={0} date={"Loading"}/>
              ) : errorTotalBalance || dataTotalBalance?.length == 0 ? (
                <CardBalance title={"Error Occurred"} balance={0} date={errorTotalBalance?.message}/>
              ) : (
                <UniqueChildren>
                  {(
                    dataTotalBalance!.sort((a:any, b:any) => b.val().value - a.val().value).map((item) => (
                        <div className={(item.key != "project" && user.role != "admin") ? "hidden" : "w-full"} key={item.key}>
                          <CardBalance title={item.key!} balance={item.val().value} date={item.val().date} route={item.val().key}/>
                        </div>
                      )
                    )
                  )}
                </UniqueChildren>
              )
            }
        </div>

        <div className='flex flex-col md:flex-row justify-around space-x-0 md:space-x-2 space-y-2 md:space-y-0 mt-3'>
          <CardIcon title={"Callback"}
          route="callback">
            <HiOutlineWrenchScrewdriver  className='mx-1 w-6 h-6 content-center'/>
          </CardIcon>
        </div>
        <div className='flex flex-col md:flex-row justify-around space-x-0 md:space-x-2 space-y-2 md:space-y-0 mt-3'>
          <CardIcon title={"Offer"} number={snapshotOffer?.length} route={"offer"}>
            <MdOutlineLocalOffer className='mx-1 w-6 h-6 content-center'/>
          </CardIcon>
        </div>
        <div className='flex flex-col md:flex-row justify-around space-x-0 md:space-x-2 space-y-2 md:space-y-0 mt-3'>
          <CardIcon title={"Error Code"} subtitle={"NICE 3000"} route={'error-nice-3000'}>
            <MdErrorOutline className='mx-1 w-6 h-6 content-center'/>
          </CardIcon>
        </div>
      </div>
    </Layout>
  );
}
