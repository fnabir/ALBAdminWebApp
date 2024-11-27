"use client"

import CardIcon from "@/components/card/CardIcon";
import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { MdDownloading, MdError } from "react-icons/md";
import {GetDatabaseReference} from "@/firebase/database";
import CardOffer from "@/components/card/CardOffer";
import {useList} from "react-firebase-hooks/database";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/firebase/config";

export default function OfferAll() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [ data, dataLoading, dataError ] = useList(GetDatabaseReference('-offer'));

  if (loading) return <Loading/>

  if (!loading && !user) return router.push("/login")

  return (
    <Layout
      pageTitle="Offer | Asian Lift Bangladesh"
      headerTitle="Offer">
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
            <CardIcon title={"No Offer Found!"}>
              <MdError className='mx-1 w-6 h-6 content-center'/>
            </CardIcon>
          ) : (
            data?.map((item) => {
              const snapshot = item.val();
              return (
                <div className="flex flex-col" key={item.key}>
                  <CardOffer id={item.key!} name={snapshot.name} address={snapshot.address}
                             product={snapshot.ptype} work={snapshot.wtype} unit={snapshot.unit}
                             floor={snapshot.floor} person={snapshot.person} shaft={snapshot.shaft}
                             date={snapshot.date} note={snapshot.note} refer={snapshot.refer}/>
                </div>
              )
            })
          )
        }
      </div>
    </Layout>
  );
}
