"use client"

import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import TotalBalance from "@/components/TotalBalance";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import CardBalance from "@/components/card/CardBalance";
import CardIcon from "@/components/card/CardIcon";
import { MdDownloading, MdError } from "react-icons/md";
import { getDatabaseValue, getObjectDataWithTotal } from "@/firebase/database";

export default function Projects() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const { data, total, dataLoading, error } = getObjectDataWithTotal('balance/project');
  
  const resultTotal = getDatabaseValue("balance/total/project/date");
  const totalBalanceDate = resultTotal.data ? resultTotal.data : ""

  while (loading) return <Loading/>
  if (!loading && !user) return router.push("login")
  else {
    return (
      <Layout 
        pageTitle="Projects | Asian Lift Bangladesh"
        headerTitle="Projects">
          <div className="flex flex-col h-full py-2 gap-y-2">
            {
              dataLoading ? (
                <CardIcon title={"Loading"} subtitle={"If data doesn't load in 30 seconds, please refresh the page."}>
                  <MdDownloading className='mx-1 w-6 h-6 content-center'/>
                </CardIcon>
              ) : error ? (
                <CardIcon title={"Error"} subtitle={error? error : ""}>
                  <MdError className='mx-1 w-6 h-6 content-center'/>
                </CardIcon>
              ) : (
                data.map((item) =>
                  (
                    <CardBalance type={"project"} id={item.key} name={item.key} value={item.value} date={item.date} status={item.status}/>
                  )
                )
              )
            }
            <TotalBalance value={total} date={totalBalanceDate}/>
          </div>
        
      </Layout>
    );
  }
}
