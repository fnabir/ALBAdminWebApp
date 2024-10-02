"use client"

import CardIcon from "@/components/card/CardIcon";
import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { MdDownloading, MdError } from "react-icons/md";
import { getDataExist, getObjectData } from "@/firebase/database";
import CardOffer from "@/components/card/CardOffer";

export default function OfferAll() {
  const router = useRouter();
  const { user, loading } = useAuth();

  while (loading) return <Loading/>
  if (!loading && !user) return router.push("login")
  else {
    const { dataExist, dataLoading, error } = getObjectData('offer');
    
    return (
      <Layout 
        pageTitle="Offer | Asian Lift Bangladesh"
        headerTitle="Offer">
        <div className="flex flex-col h-full py-2 gap-y-2">
          {
            dataLoading ? (
              <CardIcon title={"Loading"} subtitle={"If data doesn't load in 30 seconds, please refresh the page."}>
                <MdDownloading className='mx-1 w-6 h-6 content-center'/>
              </CardIcon>
            ) : error ? (
              <CardIcon title={"Error"} subtitle={error? error : ""}>
                <MdError className='mx-1 w-6 h-6 content-center'/>
              </CardIcon>
            ) : (
              <CardIcon title={"No Offer Found!"}>
                <MdError className='mx-1 w-6 h-6 content-center'/>
              </CardIcon>
            )
          }
        </div>
      </Layout>
    );
  }
}
