"use client"

import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import TotalBalance from "@/components/TotalBalance";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import CardIcon from "@/components/card/CardIcon";
import { MdDownloading, MdError } from "react-icons/md";
import {GetDatabaseReference, GetTotalValue} from "@/firebase/database";
import CardTransaction from "@/components/card/CardTransaction";
import AccessDenied from "@/components/AccessDenied";
import {useList, useObject} from "react-firebase-hooks/database";
import {update} from "firebase/database";
import {errorMessage, successMessage} from "@/utils/functions";

export default function ConveyanceTransaction() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const path = usePathname();
  const staffID: string = decodeURIComponent(path.substring(path.lastIndexOf("/") + 1));
  const [staffData] = useObject(GetDatabaseReference(`balance/conveyance/${staffID}`));
  const staffName = staffData?.val().name;

  const [ data, dataLoading, dataError ] = useList(GetDatabaseReference('transaction/conveyance/' + staffID));
  const total = GetTotalValue(data, "amount");
  const [ totalBalanceData ] = useObject(GetDatabaseReference(`balance/conveyance/${staffID}`));
  const totalBalanceValue: number = totalBalanceData?.val().value;
  const totalBalanceDate: string = totalBalanceData?.val().date;

  const updateTotal = async() => {
    update(GetDatabaseReference(`balance/conveyance/${staffID}`), {
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
            ) : dataError ? (
              <CardIcon title={"Error"} subtitle={dataError.message}>
                <MdError className='mx-1 w-6 h-6 content-center'/>
              </CardIcon>
            ) : data?.length == 0 ? (
              <CardIcon title={"No Record Found!"} subtitle={""}>
                <MdError className='mx-1 w-6 h-6 content-center'/>
              </CardIcon>
            ) : (
              data?.sort((a, b) => b.val().key.localeCompare(a.val().key)).map((item) => {
                const snapshot = item.val();
                return (
                  <div className="flex flex-col" key={item.key}>
                    <CardTransaction type={"conveyance"} uid={staffID} transactionId={item.key!}
                                     title={snapshot.title} details={snapshot.details}
                                     amount={snapshot.amount} date={snapshot.date} access={user.role}/>
                  </div>
                )
              })
            )
          }
          <TotalBalance value={total} date={totalBalanceDate} update={total != totalBalanceValue} onClick={updateTotal}/>
        </div>
      </Layout>
    );
  } else return <AccessDenied/>;
};