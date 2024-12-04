"use client"

import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import TotalBalance from "@/components/TotalBalance";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import CardIcon from "@/components/card/CardIcon";
import { MdAddCircle, MdDownloading, MdError} from "react-icons/md";
import {GenerateDatabaseKey, GetDatabaseReference, GetTotalValue} from "@/firebase/database";
import CardTransaction from "@/components/card/CardTransaction";
import AccessDenied from "@/components/AccessDenied";
import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import CustomInput from "@/components/generic/CustomInput";
import {errorMessage, successMessage} from "@/utils/functions";
import CustomDropDown from "@/components/generic/CustomDropDown";
import { format, parse } from "date-fns";
import { update } from "firebase/database";
import CustomRadioGroup from "@/components/generic/CustomRadioGroup";
import {formatInTimeZone} from "date-fns-tz";
import {useList, useObject} from "react-firebase-hooks/database";
import UniqueChildren from "@/components/UniqueChildrenWrapper";
import CustomDateTimeInput from "@/components/generic/CustomDateTimeInput";

export default function ProjectTransaction() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const path = usePathname();

  const [newModal, setNewModal] = useState(false);
  const [transactionData, setTransactionData] = useState({
    type: 'Expense', title: '', detailsLabel: 'Details', details: '', amount: 0, date: new Date(), paidStatus: "Not Paid", fullPaid: '', fullPaidAmount: 0
  })

  const transactionOptions = [
    {value: 'Expense'},
    {value: 'Payment'},
  ];
  const expenseOptions = [
      {value: 'Servicing'},
      {value: 'Callback'},
      {value: 'Spare Parts'},
      {value: 'Repairing'},
      {value: 'Others'},
  ];
  const paymentOptions = [
      {value: 'Cash'},
      {value: 'Cheque'},
      {value: 'Account Transfer'},
      {value: 'Bank Transfer'},
      {value: 'CellFin', label: 'CellFin (Phone)'},
      {value: 'CellFin (Account)', label: 'CellFin (Account)'},
      {value: 'bKash'},
  ];
  const paidStatusOptions = [
    {value: 'Not Paid'},
    {value: 'Partial'},
    {value: 'Full'},
  ];
  const [paidData] = useList(GetDatabaseReference(`balance/project`));
  const paidDataOptions = paidData ? paidData.filter(transaction => transaction.val().amount < 0).map((data) => ({ value: `${data.val().date} ${data.val().title}` })) : [];
  const titleOptions = transactionData.type == "Expense" ? expenseOptions : paymentOptions;
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

  const handleNewTransactionClick = () => {
    setTransactionData({type: 'Expense', title: '', detailsLabel: 'Details', details: '', amount: 0, date: new Date(), paidStatus: "Not Paid", fullPaid: '', fullPaidAmount: 0})
    setNewModal(true);
  }

  const handleTypeChange = (value: string) => {
    setTransactionData({...transactionData, type: value, title: 'Select', detailsLabel: 'Details', details: ''});
  }

  const handleTitleChange = (value: string, label:string) => {
    setTransactionData({...transactionData, title: value});
    switch (label) {
      case "Cash":
        setTransactionData({...transactionData, title: value, detailsLabel: 'Receiver', details: ''});
        break;
      case "Cheque":
      case "Bank Transfer":
        setTransactionData({...transactionData, title: value, detailsLabel:  'Bank Name, Branch', details: ''});
        break;
      case "Account Transfer":
      case "CellFin (Account)":
        setTransactionData({...transactionData, title: value, detailsLabel:  'Account Number', details: 'Acc No.**'});
        break;
      case "bKash":
        setTransactionData({...transactionData, title: value, detailsLabel:  'bKash Number', details: ''});
        break;
      case "Servicing":
        setTransactionData({...transactionData, title: value, detailsLabel:  'Month', details: ''});
        break;
      case "Spare Parts":
        setTransactionData({...transactionData, title: value, detailsLabel:  'Name of Parts', details: ''});
        break;
      default:
        setTransactionData({...transactionData, title: value, detailsLabel:  'Details', details: ''});
        break;
    }
    console.log(transactionData);
  }

  const saveNewTransaction = async () => {
    if (transactionData.title == "Select") {
        errorMessage(`Please select ${transactionData.type} type`)
    }
    if (!transactionData.date) {
        errorMessage("Please select a valid date")
    }

    if(transactionData && transactionData.title != "Select" && transactionData.date) {
      const updatedData = {
        title: transactionData.title,
        details: transactionData.details,
        amount: transactionData.type == "Expense" ? transactionData.amount : transactionData.amount * (-1),
        date: format(transactionData.date, "dd.MM.yy")
      }
      const newKey = GenerateDatabaseKey(`transaction/project/${projectName}`)
      const newTransactionRef = `transaction/project/${projectName}/${format(transactionData.date, "yyMMdd")}${newKey}`;
      update(GetDatabaseReference(newTransactionRef), updatedData)
        .then(() => {
          updateDate();
          successMessage("Saved the changes.")
        })
        .catch((error) => {
            console.error(error.message);
            errorMessage(error.message);
        })
        .finally(() => {
          setNewModal(false);
        })
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
                <Button color={"blue"} onClick={handleNewTransactionClick}>
                  <MdAddCircle className="mr-2 h-5 w-5"/>Add New Transaction
                </Button>
              </div>

              <Modal show={newModal} size="md" popup onClose={() => setNewModal(false)} className="bg-black bg-opacity-50">
                  <Modal.Header className="bg-slate-800 rounded-t-md text-white border-t border-x border-blue-500">
                      <div className="text-xl font-medium text-white">New Transaction</div>
                  </Modal.Header>
                  <Modal.Body className="bg-slate-950 rounded-b-md border-b border-x border-blue-500">
                      <div className="space-y-4 pt-4">
                        <CustomRadioGroup id={'transactionType'} options={transactionOptions}
                                        onChange={(value) => handleTypeChange(value)}
                                        defaultValue={transactionData.type}
                        />
                        <CustomDropDown id="title" label={`${transactionData.type} Type`} options={titleOptions}
                                        onChange={(value, label) => {handleTitleChange(value, label)}}
                        />
                        <CustomInput type="text" label={transactionData.detailsLabel} id="details"
                               value={transactionData.details}
                               onChange={(e) => setTransactionData({...transactionData, details: e.target.value})}
                               color={"default"} helperText={""}
                        />
                        <CustomInput label="Amount" value={transactionData.amount} type="number" id="amount"
                               pre={`৳ ${transactionData.type == "Payment" ? "-" : ""}`}
                               onChange={(e) => setTransactionData({...transactionData, amount: Number(e.target.value)})}
                               required={true}
                        />
                        <CustomDateTimeInput label="Date" value={format(transactionData.date, "yyyy-MM-dd")} type="date" id="date"
                               onChange={(value) => setTransactionData({...transactionData, date: parse(value, "yyyy-MM-dd", new Date())})}
                        />
                        <CustomRadioGroup id={'paidStatus'} options={paidStatusOptions}
                                          onChange={(value) => setTransactionData({...transactionData, paidStatus: value})}
                                          defaultValue={transactionData.paidStatus}
                        />
                        {
                          transactionData.paidStatus == "Full" ? (
                            <CustomDropDown id="fullPaidDate" label={`Payment Details`} options={paidDataOptions}
                                            onChange={(value) => setTransactionData({...transactionData, fullPaid : value})}
                            />
                          ) : null
                        }


                          <div className="flex gap-4 justify-center">
                              <Button color="blue" onClick={saveNewTransaction}>Save</Button>
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
                  ) : !data || data?.length == 0 ? (
                      <CardIcon title={"No record found!"}>
                        <MdError className='mx-1 w-6 h-6 content-center'/>
                      </CardIcon>
                  ) : (
                    <UniqueChildren>
                      {
                        data.sort((a, b) => b.key!.localeCompare(a.key!)).map((item) => {
                          const snapshot = item.val();
                          return (
                            <div className="flex flex-col" key={item.key}>
                              <CardTransaction type={"project"} uid={projectName} transactionId={item.key!}
                                               title={snapshot.title} details={snapshot.details}
                                               amount={snapshot.amount} date={snapshot.date}
                                               access={user.role}/>
                            </div>
                          )
                        })
                      }
                    </UniqueChildren>
                  )
                }
                <TotalBalance value={total} date={totalBalanceDate} update={total != totalBalanceValue} onClick={updateTotal}/>
              </div>
          </div>
      </Layout>
    );
  } else return <AccessDenied/>
}