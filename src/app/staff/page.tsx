"use client"

import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import TotalBalance from "@/components/TotalBalance";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import CardIcon from "@/components/card/CardIcon";
import { MdDownloading, MdError } from "react-icons/md";
import CardBalance from "@/components/card/CardBalance";
import { GetDatabaseValue, GetObjectDataWithTotal } from "@/firebase/database";
import AccessDenied from "@/components/AccessDenied";

export default function Staff() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const { data, total, dataLoading, error } = GetObjectDataWithTotal('balance/staff');

  const staffBalanceDate = GetDatabaseValue("balance/total/staff/date").data;
  const conveyanceBalance = GetDatabaseValue("balance/total/conveyance/value").data;
  const conveyanceBalanceDate = GetDatabaseValue("balance/total/staff/date").data;

  if (loading) return <Loading/>

  if (!loading && !user) return router.push("/login");

  if (user.role == "admin") {
    return (
      <Layout 
        pageTitle="Staff | Asian Lift Bangladesh"
        headerTitle="Staff">
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
                data.sort((a,b) => a.position - b.position).map((item) => (
                  <div className="flex flex-col" key={item.key}>
                    <CardBalance type={"staff"} id={item.key} name={item.name} value={item.value} date={item.date} status={item.status}/>
                  </div>
                ))
              )
            }
            <TotalBalance text="Total Conveyance" value={conveyanceBalance} date={conveyanceBalanceDate}/>
            <TotalBalance value={total + conveyanceBalance} date={staffBalanceDate}/>
          </div>
      </Layout>
    );
  } else return <AccessDenied/>;
}
