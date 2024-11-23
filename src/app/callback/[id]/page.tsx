"use client"

import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import CardIcon from "@/components/card/CardIcon";
import { MdDownloading, MdError } from "react-icons/md";
import CardCallbackProject from "@/components/card/CardCallbackProject";
import AccessDenied from "@/components/AccessDenied";
import {useList} from "react-firebase-hooks/database";
import {GetDatabaseReference} from "@/firebase/database";

export default function CallbackProject() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const path = usePathname();
  const projectName: string = decodeURIComponent(path.substring(path.lastIndexOf("/") + 1));
  const [ data, dataLoading, dataError ] = useList(GetDatabaseReference(`callback/${projectName}`));

  if (loading) return <Loading/>

  if (!loading && !user) return router.push("/login");

  if (user.role == "admin" || user.role == "manager") {
    return (
      <Layout
        pageTitle={projectName + " | Asian Lift Bangladesh"}
        headerTitle={"Callback | " + projectName}>
          <div className="flex flex-col py-2 gap-y-2">
            {
              dataLoading ? (
                <CardIcon title={"Loading"} subtitle={"If data doesn't load in 30 seconds, please refresh the page."}>
                  <MdDownloading className='mx-1 w-6 h-6 content-center'/>
                </CardIcon>
              ) : dataError ? (
                <CardIcon title={"Error"} subtitle={dataError.message}>
                  <MdError className='mx-1 w-6 h-6 content-center'/>
                </CardIcon>
              ) : data?.length == 0 ? (
                <CardIcon title={"No record found!"} >
                  <MdError className='mx-1 w-6 h-6 content-center'/>
                </CardIcon>
              ) : (
                data?.sort((a, b) => b.key!.localeCompare(a.key!)).map((item) => {
                  const snapshot = item.val();
                  return (
                    <div className="flex flex-col" key={item.key}>
                      <CardCallbackProject date={snapshot.date} details={snapshot.details} name={snapshot.name} id={item.key!}/>
                    </div>
                  )
                })
              )
            }
          </div>
      </Layout>
    );
  } else return <AccessDenied/>;
};