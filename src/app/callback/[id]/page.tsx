"use client"

import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import CardIcon from "@/components/card/CardIcon";
import { MdDownloading, MdError } from "react-icons/md";
import { GetObjectData } from "@/firebase/database";
import CardCallbackProject from "@/components/card/CardCallbackProject";
import AccessDenied from "@/components/AccessDenied";

export default function CallbackProject() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const path = usePathname();

  if (loading) return <Loading/>

  if (!loading && !user) return router.push("/login");

  if (user.role == "admin" || user.role == "manager") {
    const projectName: string = decodeURIComponent(path.substring(path.lastIndexOf("/") + 1));
    const { dataExist, data, dataLoading, error } = GetObjectData('callback/' + projectName);
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
              ) : error ? (
                <CardIcon title={"Error"} subtitle={error? error : ""}>
                  <MdError className='mx-1 w-6 h-6 content-center'/>
                </CardIcon>
              ) : !dataExist ? (
                <CardIcon title={"Not found!"} subtitle={"Project Name doesn't exist"}>
                  <MdError className='mx-1 w-6 h-6 content-center'/>
                </CardIcon>
              ) : (
                data.sort((a, b) => b.key.localeCompare(a.key)).map((item) =>
                  (
                    <div className="flex flex-col" key={item.key}>
                      <CardCallbackProject date={item.date} details={item.details} name={item.name} id={item.key}/>
                    </div>
                  )
                )
              )
            }
          </div>
      </Layout>
    );
  } else return <AccessDenied/>;
};