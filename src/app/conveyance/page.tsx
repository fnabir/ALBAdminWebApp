"use client"

import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import TotalBalance from "@/components/TotalBalance";
import { useAuth } from "@/context/AuthContext";
import { database } from "@/firebase/config";
import { child, get, ref } from "firebase/database";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Conveyance() {
  const [dataLoading, setDataLoading] = useState(true)
  const [conveyanceBalance, setConveyanceBalance] = useState<TotalBalanceInterface>({value: 0, date:""});

  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (dataLoading) {
      get(child(ref(database), 'balance/total/conveyance')).then((snapshot) => {
        if (snapshot.exists()) {
          setConveyanceBalance({value: snapshot.val().value, date: snapshot.val().date});
        } else {
          console.log("No data available");
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
        pageTitle="Conveyance | Asian Lift Bangladesh"
        headerTitle="Conveyance">
        <div className="flex flex-col-reverse h-full py-2">
          <TotalBalance text='Total Conveyance' value={conveyanceBalance.value} date={conveyanceBalance.date}/>
        </div>
      </Layout>
    );
  }
}
