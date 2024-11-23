"use client"

import CardIcon from "@/components/card/CardIcon";
import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { MdDownloading, MdError } from "react-icons/md";
import CardCallbackTotal from "@/components/card/CardCallbackTotal";
import AccessDenied from "@/components/AccessDenied";
import {useList} from "react-firebase-hooks/database";
import {GetDatabaseReference} from "@/firebase/database";

export default function Callback() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [ data, dataLoading, dataError ] = useList(GetDatabaseReference('callback'));

  if (loading) return <Loading/>

  if (!loading && !user) return router.push("/login")

  if (user.role == "admin" || user.role == "manager") {
    return (
      <Layout 
        pageTitle="Callback | Asian Lift Bangladesh"
        headerTitle="Callback">
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
              <CardIcon title={"No record found!"}>
                <MdError className='mx-1 w-6 h-6 content-center'/>
              </CardIcon>
            ) : (
              data?.map((item) =>
              (
                <div className="flex flex-col" key={item.key}>
                  <CardCallbackTotal name={item.key!} value={item.size} id={item.key!}/>
                </div>
              ))
            )
          }
        </div>
      </Layout>
    );
  } else return <AccessDenied/>;
}
