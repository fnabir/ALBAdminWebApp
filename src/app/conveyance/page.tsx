"use client"

import CardIcon from "@/components/card/CardIcon";
import Layout from "@/components/Layout";
import CardBalance from "@/components/card/CardBalance";
import Loading from "@/components/Loading";
import TotalBalance from "@/components/TotalBalance";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { MdDownloading, MdError } from "react-icons/md";
import { GetDatabaseValue, GetObjectDataWithTotal } from "@/firebase/database";
import AccessDenied from "@/components/AccessDenied";

export default function Conveyance() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const { data, total, dataLoading, error } = GetObjectDataWithTotal('balance/conveyance');
  
  const conveyanceBalanceDate = GetDatabaseValue("balance/total/conveyance/date").data;

  while (loading) return <Loading/>
  if (!loading && !user) return router.push("/login");
  else if (user.role == "admin") {
    return (
      <Layout 
        pageTitle="Conveyance | Asian Lift Bangladesh"
        headerTitle="Conveyance">
        <div className="flex flex-col py-2 gap-y-2">
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
              data.sort((a,b) => a.position - b.position).map((item) => 
              (
                <div className="flex flex-col" key={item.key}>
                  <CardBalance type={"conveyance"} name={item.name} value={item.value} date={item.date} status={item.status} id={item.key}/>
                </div>
              ))
            )
          }
          <TotalBalance text='Total Conveyance' value={total} date={conveyanceBalanceDate}/>
        </div>
      </Layout>
    );
  } else return <AccessDenied/>;
}
