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
import AccessDenied from "@/components/AccessDenied";
import {ref, update} from "firebase/database";
import {database} from "@/firebase/config";
import {errorMessage, successMessage} from "@/utils/functions";

export default function Projects() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sort, setSort] = useState("name");

  const activeButtonClass = "bg-blue-600 hover:bg-blue-800 text-white font-semibold py-1 px-4 rounded-full";
  const notActiveButtonClass = "bg-transparent hover:bg-blue-800 text-blue-400 font-semibold hover:text-white py-1 px-4 border border-blue-400 hover:border-transparent rounded-full"

  const { data, total, dataLoading, error } = GetObjectDataWithTotal('balance/project');
  const totalBalanceValue = GetDatabaseValue(`balance/total/project/value`).data;
  const totalBalanceDate = GetDatabaseValue("balance/total/project/date").data;

  const updateTotal = async() => {
    update(ref(database, `balance/total/project`), {
      value: total,
    }).then(() => {
      successMessage("Total balance updated successfully!");
      window.location.reload();
    }).catch((error) => {
      console.error(error.message);
      errorMessage(error.message);
    })
  }

  if (loading) return <Loading/>

  if (!loading && !user) return router.push("/login");

  if (user.role == "admin" || user.role == "manager") {
    return (
      <Layout 
        pageTitle="Projects | Asian Lift Bangladesh"
        headerTitle="Projects">
          <div>
            <div className="flex items-center mt-2 gap-x-2">
              <div>Sort by</div>
              <button className={sort == "name" ? activeButtonClass : notActiveButtonClass} onClick={() => setSort("name")}>Name</button>
              <button className={sort == "value" ? activeButtonClass : notActiveButtonClass} onClick={() => setSort("value")}>Value</button>
              <button className={sort == "register" ? activeButtonClass : notActiveButtonClass} onClick={() => setSort("register")}>Register</button>
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
              <TotalBalance value={total} date={totalBalanceDate} update={total != totalBalanceValue} onClick={updateTotal}/>
            </div>
          </div>
      </Layout>
    );
  } else return <AccessDenied/>;
}