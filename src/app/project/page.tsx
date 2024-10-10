"use client"

import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import TotalBalance from "@/components/TotalBalance";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import CardBalance from "@/components/card/CardBalance";
import CardIcon from "@/components/card/CardIcon";
import { MdDownloading, MdError } from "react-icons/md";
import { GetDatabaseValue, GetObjectDataWithTotal } from "@/firebase/database";
import { useState } from "react";

export default function Projects() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sort, setSort] = useState("name");

  const activeButtonClass = "bg-blue-600 hover:bg-blue-800 text-white font-semibold py-1 px-4 rounded-full";
  const notActiveButtonClass = "bg-transparent hover:bg-blue-800 text-blue-400 font-semibold hover:text-white py-1 px-4 border border-blue-400 hover:border-transparent rounded-full"

  const { data, total, dataLoading, error } = GetObjectDataWithTotal('balance/project');
  const resultTotal = GetDatabaseValue("balance/total/project/date");
  const totalBalanceDate = resultTotal.data ? resultTotal.data : ""

  const handleSortChange = (option: string) => {
    setSort(option);
  };

  while (loading) return <Loading/>
  if (!loading && !user) return router.push("login")
  else {
    return (
      <Layout 
        pageTitle="Projects | Asian Lift Bangladesh"
        headerTitle="Projects">
          <div>
            <div className="flex items-center mt-2 gap-x-2">
              <div>Sort by</div>
              <button className={sort == "name" ? activeButtonClass : notActiveButtonClass} onClick={() => handleSortChange("name")}>Name</button>
              <button className={sort == "value" ? activeButtonClass : notActiveButtonClass} onClick={() => handleSortChange("value")}>Value</button>
              <button className={sort == "register" ? activeButtonClass : notActiveButtonClass} onClick={() => handleSortChange("register")}>Register</button>
            </div>
            
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
                ) : sort == "value" ? (
                  data.sort((a,b) => a.value - b.value).map((item) =>
                    (
                      <div className="flex flex-col" key={item.key}>
                        <CardBalance type={"project"} id={item.key} name={item.key} value={item.value} date={item.date} status={item.status}/>
                      </div>
                    )
                  )
                ) : sort == "register" ? (
                  data.sort((a,b) => a.register - b.register)).map((item) =>
                    (
                      <div className="flex flex-col" key={item.key}>
                        <CardBalance type={"project"} id={item.key} name={item.key} value={item.value} date={item.date} status={item.status}/>
                      </div>
                    )
                ) : (
                  data.sort((a, b) => a.key.localeCompare(b.key)).map((item) =>
                    (
                      <div className="flex flex-col" key={item.key}>
                        <CardBalance type={"project"} id={item.key} name={item.key} value={item.value} date={item.date} status={item.status}/>
                      </div>
                    )
                ))
              }
              <TotalBalance value={total} date={totalBalanceDate}/>
            </div>
          </div>
      </Layout>
    );
  }
}
