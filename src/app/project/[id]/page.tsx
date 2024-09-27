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
import CardTransaction from "@/components/card/CardTransaction";

export default function ProjectTransaction() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const projectName = "CDDL";

  if (projectName != null){
    const { data, total, dataLoading, error } = getObjectDataWithTotal('transaction/project/' + projectName);
    const totalBalanceDate = getDatabaseValue("balance/project/" + projectName + "/date").date;

    while (loading) return <Loading/>
    if (!loading && !user) return router.push("login")
    else {
      return (
        <Layout 
          pageTitle={projectName + " | Asian Lift Bangladesh"}
          headerTitle={projectName}>
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
                      <CardTransaction title={item.title} amount={item.amount} date={item.date} details={item.details}/>
                    )
                  )
                )
              }
              <TotalBalance value={total} date={totalBalanceDate}/>
            </div>
          
        </Layout>
      );
    }
  } else window.history.back;
}
