"use client"

import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import TotalBalance from "@/components/TotalBalance";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { database } from "@/firebase/config";
import { child, get, ref } from "firebase/database";
import { useEffect, useState } from "react";

export default function Staff() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [dataLoading, setDataLoading] = useState(true)
  const [staffBalance, setStaffBalance] = useState<TotalBalanceInterface>({value: 0, date:""});
  const [conveyanceBalance, setConveyanceBalance] = useState<TotalBalanceInterface>({value: 0, date:""});

  useEffect(() => {
    if (dataLoading) {
      get(child(ref(database), 'balance/total/staff')).then((snapshot) => {
        if (snapshot.exists()) {
          setStaffBalance({value: snapshot.val().value, date: snapshot.val().date});
        } else {
          setStaffBalance({value: 0, date: ""});
        }
      }).catch((error) => {
        console.error(error);
      });
      get(child(ref(database), 'balance/total/conveyance')).then((snapshot) => {
        if (snapshot.exists()) {
          setConveyanceBalance({value: snapshot.val().value, date: snapshot.val().date});
        } else {
          setConveyanceBalance({value: 0, date: ""});
        }
      }).catch((error) => {
        console.error(error);
      });
      setDataLoading(false)
    }
  });

  while (loading) return <Loading/>
  if (!loading && !user) return router.push("login")
  else {
    return (
      <Layout 
        pageTitle="Staff | Asian Lift Bangladesh"
        headerTitle="Staff">
          <div className="flex flex-col-reverse h-full py-2 gap-y-2">
            <TotalBalance text="Total Conveyance" value={conveyanceBalance.value} date={conveyanceBalance.date}/>
            <TotalBalance value={staffBalance.value + conveyanceBalance.value} date={staffBalance.date}/>
          </div>
      </Layout>
    );
  }
}
