"use client"

import CardBalance from "@/components/card/CardTotalBalance";
import { MdOutlineBuild , MdOutlineLocalOffer, MdErrorOutline } from "react-icons/md";
import CardIcon from "@/components/card/CardIcon";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { GetDataCount, GetObjectDataWithTotal } from "@/firebase/database";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const { data, dataLoading, error } = GetObjectDataWithTotal('balance/total');
  const offerCount = GetDataCount('-offer');

  while (loading) return <Loading/>
  if (!loading && !user) return router.push("login")
  else {
    return (
      <Layout 
        pageTitle="Asian Lift Bangladesh"
        headerTitle="Dashboard">
        <div>
          <div className='flex flex-col md:flex-row justify-around space-x-0 md:space-x-2 space-y-2 md:space-y-0 mt-3'>
              { 
                dataLoading ? (
                  <CardBalance title={"Loading"} balance={0} date={"Loading"}/>
                ) : error ? (
                  <CardBalance title={"Error Occured"} balance={0} date={error}/>
                ) : (
                  data.sort((a:any, b:any) => b.value - a.value).map((item) => (
                    <div className="w-full" key={item.key}>
                      <CardBalance title={item.key} balance={item.value} date={item.date} route={item.key}/>
                    </div>
                  ))
                )
              }
          </div>

          <div className='flex flex-col md:flex-row justify-around space-x-0 md:space-x-2 space-y-2 md:space-y-0 mt-3'>
            <CardIcon title={"Callback"}
            route="callback">
              <MdOutlineBuild  className='mx-1 w-6 h-6 content-center'/>
            </CardIcon>
          </div>
          <div className='flex flex-col md:flex-row justify-around space-x-0 md:space-x-2 space-y-2 md:space-y-0 mt-3'>
            <CardIcon title={"Offer"} number={offerCount.dataCount} route={"offer"}>
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
}
