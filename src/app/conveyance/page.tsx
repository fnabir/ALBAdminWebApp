"use client"

import CardIcon from "@/components/card/CardIcon";
import Layout from "@/components/Layout";
import CardBalance from "@/components/card/CardBalance";
import Loading from "@/components/Loading";
import TotalBalance from "@/components/TotalBalance";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { MdDownloading, MdError } from "react-icons/md";
import { GetDatabaseReference, GetTotalValue } from "@/firebase/database";
import AccessDenied from "@/components/AccessDenied";
import {useList, useObject} from "react-firebase-hooks/database";
import {update} from "firebase/database";
import {errorMessage, successMessage} from "@/utils/functions";
import UniqueChildren from "@/components/UniqueChildrenWrapper";

export default function Conveyance() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [ data, dataLoading, dataError ] = useList(GetDatabaseReference("balance/conveyance"));
  const total = GetTotalValue(data);
  const [conveyanceBalance] = useObject(GetDatabaseReference("balance/total/conveyance"));
  const conveyanceBalanceValue: number = conveyanceBalance?.val().value;
  const conveyanceBalanceDate: string = conveyanceBalance?.val().date;

  const updateTotal = async() => {
    update(GetDatabaseReference(`balance/total/conveyance`), {
      value: total,
    }).then(() => {
      successMessage("Total balance updated successfully!");
    }).catch((error) => {
      console.error(error.message);
      errorMessage(error.message);
    })
  }

  if (loading) return <Loading/>

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
            ) : dataError ? (
              <CardIcon title={"Error"} subtitle={dataError.message}>
                <MdError className='mx-1 w-6 h-6 content-center'/>
              </CardIcon>
            ) : !data || data.length == 0 ? (
              <CardIcon title={"No record found!"} >
                <MdError className='mx-1 w-6 h-6 content-center'/>
              </CardIcon>
            ) :(
              <UniqueChildren>
                {
                  data.sort((a,b) => a.val().position - b.val().position).map((item) => {
                    const itemSnapShot = item.val();
                    return (
                      <div className={"flex flex-col"} key={item.key}>
                        <CardBalance type={"conveyance"} name={itemSnapShot.name} value={itemSnapShot.value} date={itemSnapShot.date}
                                    status={itemSnapShot.status} id={item.key ? item.key : "undefined"}/>
                      </div>
                    )
                  })
                }
              </UniqueChildren>
            )
          }
          <TotalBalance text='Total Conveyance' value={total} date={conveyanceBalanceDate} update={total !== conveyanceBalanceValue} onClick={updateTotal}/>
        </div>
      </Layout>
    );
  } else return <AccessDenied/>;
}
