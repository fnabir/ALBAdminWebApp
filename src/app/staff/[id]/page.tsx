"use client"

import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import TotalBalance from "@/components/TotalBalance";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import CardIcon from "@/components/card/CardIcon";
import { MdDownloading, MdError } from "react-icons/md";
import { GetDatabaseValue, GetObjectDataWithTotal } from "@/firebase/database";
import CardTransaction from "@/components/card/CardTransaction";
import AccessDenied from "@/components/AccessDenied";

export default function StaffTransaction() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const path = usePathname();

  if (loading) return <Loading/>

  if (!loading && !user) return router.push("login");

  if (user.role == "admin") {
    const staffID: string = decodeURIComponent(path.substring(path.lastIndexOf("/") + 1));
    const staffName = GetDatabaseValue("balance/staff/" + staffID + "/name").data;
    const { dataExist, data, total, dataLoading, error } = GetObjectDataWithTotal('transaction/staff/' + staffID);
    const totalBalanceDate = GetDatabaseValue("balance/staff/" + staffID + "/date").data;

    return(
      <Layout
        pageTitle={staffName + " | Asian Lift Bangladesh"}
        headerTitle={staffName}>
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
            ) : !dataExist ? (
              <CardIcon title={"No Record Found!"} subtitle={""}>
                <MdError className='mx-1 w-6 h-6 content-center'/>
              </CardIcon>
            ) : (
              data.sort((a, b) => b.key.localeCompare(a.key)).map((item) =>
                (
                  <div className="flex flex-col" key={item.key}>
                    <CardTransaction title={item.title} amount={item.amount} date={item.date} details={item.details} id={item.key} access={user.role}/>
                  </div>
                )
              )
            )
          }
          <TotalBalance value={total} date={totalBalanceDate}/>
        </div>
      </Layout>
    );
  } else return <AccessDenied/>;
};