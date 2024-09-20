"use client"

import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import TotalBalance from "@/components/TotalBalance";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { database } from "@/firebase/config";
import { child, get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import ProjectBalance from "@/components/lists/ProjectBalance";

export default function Projects() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [dataLoading, setDataLoading] = useState(true)
  const [projectBalance, setProjectBalance] = useState<TotalBalanceInterface>({value: 0, date:""});

  useEffect(() => {
    if (dataLoading) {
      get(child(ref(database), 'balance/total/project')).then((snapshot) => {
        if (snapshot.exists()) {
          setProjectBalance({value: snapshot.val().value, date: snapshot.val().date});
        } else {
          setProjectBalance({value: 0, date: ""});
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
        pageTitle="Projects | Asian Lift Bangladesh"
        headerTitle="Projects">
          <div className="flex flex-col h-full py-2 gap-y-2">
            <div className="h-full">
              <ProjectBalance name="Al Safa B&H" value={0} date="20 Aug 2024"/>
            </div>
            <TotalBalance value={projectBalance.value} date={projectBalance.date}/>
          </div>
        
      </Layout>
    );
  }
}
