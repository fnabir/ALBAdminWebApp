"use client"

import CardBalance from "@/components/card/CardBalance";
import { MdOutlineBuild , MdOutlineLocalOffer, MdErrorOutline } from "react-icons/md";
import CardIcon from "@/components/card/CardIcon";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { database } from "@/firebase/config";
import Loading from "@/components/Loading";

export default function Home() {
  const [dataLoading, setDataLoading] = useState(true)
  const [projectBalance, setProjectBalance] = useState<TotalBalanceInterface>({value: 0, date:""});
  const [staffBalance, setStaffBalance] = useState<TotalBalanceInterface>({value: 0, date:""});
  const [conveyanceBalance, setConveyanceBalance] = useState<TotalBalanceInterface>({value: 0, date:""});
  const router = useRouter();
  const { user, loading } = useAuth();

  const projectBalanceRef = ref(database, 'balance/total/project');
  const staffBalanceRef = ref(database, 'balance/total/staff');
  const conveyanceBalanceRef = ref(database, 'balance/total/conveyance');
  
  useEffect(() => {
    if (dataLoading) {
      get(projectBalanceRef).then((snapshot) => {
        console.log("Project balance");
        if (snapshot.exists()) {
          setProjectBalance({value: snapshot.val().value, date: snapshot.val().date});
        } else {
          console.log('No data available');
        }
      }).catch((error) => {
        console.log(error);
      });

      get(staffBalanceRef).then((snapshot) => {
        console.log("Staff balance");
        if (snapshot.exists()) {
          setStaffBalance({value: snapshot.val().value, date: snapshot.val().date});
        } else {
          console.log('No data available');
        }
      }).catch((error) => {
        console.log(error);
      });

      get(conveyanceBalanceRef).then((snapshot) => {
        console.log("Conveyance balance");
        if (snapshot.exists()) {
          setConveyanceBalance({value: snapshot.val().value, date: snapshot.val().date});
        } else {
          console.log('No data available');
        }
      }).catch((error) => {
        console.log(error);
      });

      setDataLoading(false)
    }
  });

  while (loading) return <Loading/>
  if (!loading && !user) return router.push("login")
  else {
    return (
      <Layout 
        pageTitle="Asian Lift Bangladesh"
        headerTitle="Dashboard">
        <div className="h-full">
          <div className='flex flex-col md:flex-row justify-around space-x-0 md:space-x-2 space-y-2 md:space-y-0 mt-3'>
            <CardBalance 
              title="Project Balance" 
              balance={projectBalance.value} 
              date={projectBalance.date}
              route='projects'/>
            <CardBalance
              title="Staff Balance" 
              balance={staffBalance.value} 
              date={staffBalance.date} 
              route='staff'/>
            <CardBalance 
            title="Conveyance Balance" 
            balance={conveyanceBalance.value} 
            date={conveyanceBalance.date} 
            route='conveyance'/>
          </div>

          <div className='flex flex-col md:flex-row justify-around space-x-0 md:space-x-2 space-y-2 md:space-y-0 mt-3'>
            <CardIcon
              icon = {<MdOutlineBuild  className='mx-1 w-6 h-6 content-center'/>}
              title={"Callback"}/>
          </div>
          <div className='flex flex-col md:flex-row justify-around space-x-0 md:space-x-2 space-y-2 md:space-y-0 mt-3'>
            <CardIcon
              icon = {<MdOutlineLocalOffer className='mx-1 w-6 h-6 content-center'/>}
              title={"Offer"}
              number={0}/>
          </div>
          <div className='flex flex-col md:flex-row justify-around space-x-0 md:space-x-2 space-y-2 md:space-y-0 mt-3'>
            <CardIcon
              icon = {<MdErrorOutline className='mx-1 w-6 h-6 content-center'/>}
              title={"Error Code"}
              subtitle={"NICE 3000"}/>
          </div>
        </div>
      </Layout>
    );
  }
}
