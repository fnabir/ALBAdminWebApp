"use client"

import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import TotalBalance from "@/components/TotalBalance";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import CardIcon from "@/components/card/CardIcon";
import { MdAddCircle, MdDownloading, MdError} from "react-icons/md";
import {GetDatabaseReference, GetTotalValue} from "@/firebase/database";
import CardTransaction from "@/components/card/CardTransaction";
import AccessDenied from "@/components/AccessDenied";
import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import CustomInput from "@/components/generic/CustomInput";
import { errorMessage, successMessage } from "@/utils/functions";
import CustomDropDown from "@/components/generic/CustomDropDown";
import { format, parse } from "date-fns";
import { child, push, ref, update } from "firebase/database";
import { database } from "@/firebase/config";
import CustomRadioGroup from "@/components/generic/CustomRadioGroup";
import {formatInTimeZone} from "date-fns-tz";
import {useList, useObject} from "react-firebase-hooks/database";

export default function ProjectTransaction() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const path = usePathname();

  const [newModal, setNewModal] = useState(false);
  const [transactionType, setTransactionType] = useState("Expense");
  const [inputTitle, setInputTitle] = useState("");
  const [inputDetailsLabel, setInputDetailsLabel] = useState("Details");
  const [inputDetails, setInputDetails] = useState("");
  const [inputAmount, setInputAmount] = useState(0);
  const [inputDate, setInputDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const transactionOptions = [
    { value: 'Expense', label: 'Expense' },
    { value: 'Payment', label: 'Payment' },
  ];
  const expenseOptions = [
      { value: 'Servicing', label: 'Servicing' },
      { value: 'Callback', label: 'Callback'},
      { value: 'Spare Parts', label: 'Spare Parts' },
      { value: 'Repairing', label: 'Repairing'},
      { value: 'Others', label: 'Others'},
  ];
  const paymentOptions = [
      {value: 'Cash', label: 'Cash'},
      {value: 'Cheque', label: 'Cheque'},
      {value: 'Account Transfer', label: 'Account Transfer'},
      {value: 'Bank Transfer', label: 'Bank Transfer'},
      {value: 'CellFin', label: 'CellFin (Phone)'},
      {value: 'CellFin (Account)', label: 'CellFin (Account)'},
      {value: 'bKash', label: 'bKash'},
  ];

  const titleOptions = transactionType == "Expense" ? expenseOptions : paymentOptions;
  const projectName: string = decodeURIComponent(path.substring(path.lastIndexOf("/") + 1));
  const [ data, dataLoading, errorData ] = useList(GetDatabaseReference(`transaction/project/${projectName}`));
  const total = GetTotalValue(data, "amount");
  const [ totalBalanceData ] = useObject(GetDatabaseReference(`balance/project/${projectName}`));
  const totalBalanceValue: number = totalBalanceData?.val().value;
  const totalBalanceDate: string = totalBalanceData?.val().date;

  const updateDate = async() => {
    const today = new Date();
    const todayTZ = formatInTimeZone(today, 'Asia/Dhaka', 'dd MMM yyyy');
    const formattedDate = format(todayTZ, "dd MMM yyyy")

    update(GetDatabaseReference(`balance/total/project`), {
        date: formattedDate,
    }).catch((error) => {
        console.error(error.message);
        errorMessage(error.message);
    })

    update(GetDatabaseReference(`balance/project/${projectName}`), {
        date: formattedDate,
    }).catch((error) => {
        console.error(error.message);
        errorMessage(error.message);
    })
  }

  const updateTotal = async() => {
    update(GetDatabaseReference(`balance/project/${projectName}`), {
      value: total,
    }).then(() => {
      successMessage("Total balance updated successfully!");
    }).catch((error) => {
      console.error(error.message);
      errorMessage(error.message);
    })
  }

  const handleTypeChange = (value: string) => {
    setTransactionType(value);
    setInputTitle("Select");
    setInputDetailsLabel("Details");
    setInputDetails("");
  }

  const handleTitleChange = (value: string, label:string) => {
    setInputTitle(value);
    switch (label) {
        case "Cash":
            setInputDetailsLabel("Receiver");
            setInputDetails("");
            break;
        case "Cheque":
        case "Bank Transfer":
            setInputDetailsLabel("Bank Name, Branch");
            setInputDetails("");
            break;
        case "Account Transfer":
        case "CellFin (Account)":
            setInputDetailsLabel("Account Number");
            setInputDetails("Acc No.**");
            break;
        case "bKash":
            setInputDetailsLabel("bKash Number");
            setInputDetails("");
            break;
        case "Servicing":
            setInputDetailsLabel("Month");
            setInputDetails("");
            break;
        case "Spare Parts":
            setInputDetailsLabel("Name of Parts");
            setInputDetails("");
            break;
        default:
            setInputDetailsLabel("Details");
            setInputDetails("");
            break;
    }
  }

  const handleNew = async () => {
    if (inputTitle == "Select") {
        errorMessage(`Please select ${transactionType} type`)
    }
    if (!inputDate) {
        errorMessage("Please select a valid date")
    }

    if(inputTitle != "Select" && inputDate) {
      const updatedData = {
        title: inputTitle,
        details: inputDetails,
        amount: transactionType == "Expense" ? inputAmount : inputAmount * (-1),
        date: format(parse(inputDate, "yyyy-MM-dd", new Date()), "dd.MM.yy")
      }
      const newKey = push(child(ref(database), `transaction/project/${projectName}`)).key
      const newTransactionRef = `transaction/project/${projectName}/${format(parse(inputDate, "yyyy-MM-dd", new Date()), "yyMMdd")}${newKey}`;
      update(ref(database, newTransactionRef), updatedData)
          .then(() => {
            setNewModal(false);
            updateDate();
            successMessage("Saved the changes.")
            window.location.reload();
        })
        .catch((error) => {
            console.error(error.message);
            errorMessage(error.message);
        })
      successMessage("Saved the changes.")
    }
  };

  if (loading) return <Loading/>

  if (!loading && !user) return router.push("/login");

  if (user.role == "admin" || user.role == "manager") {
      return (
      <Layout
          pageTitle={projectName + " | Asian Lift Bangladesh"}
          headerTitle={projectName}>
          <div>
              <div className="flex items-center mt-2 gap-x-2">
                <Button color={"blue"} onClick={()=> setNewModal(true)}>
                  <MdAddCircle className="mr-2 h-5 w-5"/>Add New Transaction
                </Button>
              </div>

              <Modal show={newModal} size="md" popup onClose={() => setNewModal(false)} className="bg-black bg-opacity-50">
                  <Modal.Header className="bg-slate-800 rounded-t-md text-white border-t border-x border-blue-500">
                      <div className="text-xl font-medium text-white">New Transaction</div>
                  </Modal.Header>
                  <Modal.Body className="bg-slate-950 rounded-b-md border-b border-x border-blue-500">
                      <div className="space-y-4 pt-4">
                          <CustomRadioGroup options={transactionOptions}
                                          onChange={(value) => handleTypeChange(value)}
                                          defaultValue={transactionType}
                          />
                          <CustomDropDown id="title" label={`${transactionType} Type`} options={titleOptions}
                                          onChange={(value, label) => {handleTitleChange(value, label)}}
                          />
                          <CustomInput type="text" label={inputDetailsLabel} id="details"
                                 value={inputDetails}
                                 onChange={(e) => setInputDetails(e.target.value)}
                                 color={"default"} helperText={""}
                          />
                          <CustomInput label="Amount" value={String(inputAmount)} type="number" id="amount"
                                 pre={`৳ ${transactionType == "Payment" ? "-" : ""}`}
                                 onChange={(e) => setInputAmount(Number(e.target.value))}
                                 required
                          />
                          <CustomInput label="Date" value={inputDate} type="date" id="date"
                                 onChange={(e) => setInputDate(e.target.value)}
                          />

                          <div className="flex gap-4 justify-center">
                              <Button color="blue" onClick={handleNew}>Save</Button>
                              <Button color="gray" onClick={() => setNewModal(false)}>Cancel</Button>
                          </div>
                      </div>
                  </Modal.Body>
              </Modal>

              <div className="flex flex-col py-2 gap-y-2">
                  {
                      dataLoading ? (
                          <CardIcon title={"Loading"}
                                    subtitle={"If data doesn't load in 30 seconds, please refresh the page."}>
                          <MdDownloading className='mx-1 w-6 h-6 content-center'/>
                      </CardIcon>
                  ) : errorData ? (
                      <CardIcon title={"Error"} subtitle={errorData.message}>
                        <MdError className='mx-1 w-6 h-6 content-center'/>
                      </CardIcon>
                  ) : data?.length == 0 ? (
                      <CardIcon title={"No record found!"}>
                        <MdError className='mx-1 w-6 h-6 content-center'/>
                      </CardIcon>
                  ) : (
                      data?.sort((a, b) => b.key!.localeCompare(a.key!)).map((item) => {
                          const snapshot = item.val();
                          return (
                            <div className="flex flex-col" key={item.key}>
                              <CardTransaction type={"project"} uid={projectName} transactionId={item.key!}
                                               title={snapshot.title} details={snapshot.details}
                                               amount={snapshot.amount} date={snapshot.date}
                                               access={user.role}/>
                            </div>
                          )
                        }
                      )
                  )
                }
                <TotalBalance value={total} date={totalBalanceDate} update={total != totalBalanceValue} onClick={updateTotal}/>
              </div>
          </div>
      </Layout>
    );
  } else return <AccessDenied/>
}