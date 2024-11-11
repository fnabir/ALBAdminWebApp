"use client"

import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import TotalBalance from "@/components/TotalBalance";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import CardIcon from "@/components/card/CardIcon";
import { MdAddCircle, MdDownloading, MdError} from "react-icons/md";
import { GetDatabaseValue, useGetObjectDataWithTotal } from "@/firebase/database";
import CardTransaction from "@/components/card/CardTransaction";
import AccessDenied from "@/components/AccessDenied";
import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import Input from "@/components/generic/Input";
import { successMessage } from "@/utils/functions";
import { format } from "date-fns";

export default function ProjectTransaction() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const path = usePathname();

  const [newModal, setNewModal] = useState(false);
  const [transactionType, setTransactionType] = useState("Expense");
  const [inputTitle, setInputTitle] = useState("");
  const [inputDetails, setInputDetails] = useState("");
  const [inputAmount, setInputAmount] = useState(0);
  const [inputDate, setInputDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const titleOptions = transactionType == "Expense" ? ["Servicing", "Spare Parts"] : ["Cash", "Bank Transfer"];
  const projectName: string = decodeURIComponent(path.substring(path.lastIndexOf("/") + 1));
  const { dataExist, data, total, dataLoading, error } = useGetObjectDataWithTotal('transaction/project/' + projectName);
  const totalBalanceDate = GetDatabaseValue("balance/project/" + projectName + "/date").data;

  if (loading) return <Loading/>

  if (!loading && !user) return router.push("/login");

  if (user.role == "admin" || user.role == "manager") {
      return (
      <Layout
          pageTitle={projectName + " | Asian Lift Bangladesh"}
          headerTitle={projectName}>
          <div>


              <div className="flex flex-col py-2 gap-y-2">
                  {
                      dataLoading ? (
                          <CardIcon title={"Loading"}
                                    subtitle={"If data doesn't load in 30 seconds, please refresh the page."}>
                          <MdDownloading className='mx-1 w-6 h-6 content-center'/>
                      </CardIcon>
                  ) : error ? (
                      <CardIcon title={"Error"} subtitle={error ? error : ""}>
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
                                <CardTransaction type={"project"} uid={projectName} transactionId={item.key}
                                                 title={item.title} details={item.details}
                                                 amount={item.amount} date={item.date}
                                                 access={user.role}/>
                              </div>
                          )
                      )
                  )
                }
                <TotalBalance value={total} date={totalBalanceDate}/>
              </div>
          </div>
      </Layout>
    );
  } else return <AccessDenied/>
}