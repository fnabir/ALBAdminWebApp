"use client"

import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import TotalBalance from "@/components/TotalBalance";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import CardIcon from "@/components/card/CardIcon";
import { MdDownloading, MdError } from "react-icons/md";
import CardBalance from "@/components/card/CardBalance";
import {GetDatabaseReference, GetTotalValue} from "@/firebase/database";
import AccessDenied from "@/components/AccessDenied";
import {useList, useObject} from "react-firebase-hooks/database";
import {update} from "firebase/database";
import {errorMessage, successMessage} from "@/utils/functions";

export default function Staff() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [ data, dataLoading, dataError ] = useList(GetDatabaseReference('balance/staff'));
  const total = GetTotalValue(data);

  const [ staffBalanceData ] = useObject(GetDatabaseReference(`balance/total/staff`))
  const staffBalanceValue = staffBalanceData?.val().value;
  const staffBalanceDate = staffBalanceData?.val().date;
  const [ conveyanceBalanceData ] = useObject(GetDatabaseReference(`balance/total/conveyance`))
  const conveyanceBalanceValue = conveyanceBalanceData?.val().value;
  const conveyanceBalanceDate = conveyanceBalanceData?.val().date;

  const updateTotal = async() => {
    update(GetDatabaseReference(`balance/total/staff}`), {
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
              ) : dataError ? (
                <CardIcon title={"Error"} subtitle={dataError.message}>
                  <MdError className='mx-1 w-6 h-6 content-center'/>
                </CardIcon>
              ) : (
                data?.sort((a,b) => a.val().position - b.val().position).map((item) => {
                  const snapshot = item.val();
                  return (
                    <div className="flex flex-col" key={item.key}>
                      <CardBalance type={"staff"} id={item.key!} name={snapshot.name} value={snapshot.value} date={snapshot.date}
                                   status={snapshot.status}/>
                    </div>
                  )
                })
              )
            }
            <TotalBalance text="Total Conveyance" value={conveyanceBalanceValue} date={conveyanceBalanceDate}/>
            <TotalBalance value={total + conveyanceBalanceValue} date={staffBalanceDate} update={total != staffBalanceValue} onClick={updateTotal}/>
          </div>
      </Layout>
    );
  } else return <AccessDenied/>;
}
