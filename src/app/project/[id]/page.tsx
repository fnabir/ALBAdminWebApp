"use client"

import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import TotalBalance from "@/components/TotalBalance";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import CardIcon from "@/components/card/CardIcon";
import {MdAddCircle, MdDelete, MdDownloading, MdError} from "react-icons/md";
import {GetDatabaseReference, GetTotalValue} from "@/firebase/database";
import CardTransaction from "@/components/card/CardTransaction";
import AccessDenied from "@/components/AccessDenied";
import { Button, Modal } from "flowbite-react";
import {useState} from "react";
import CustomInput from "@/components/generic/CustomInput";
import {errorMessage, formatCurrency, successMessage} from "@/utils/functions";
import CustomDropDown from "@/components/generic/CustomDropDown";
import { format, parse } from "date-fns";
import { child, push, ref, update } from "firebase/database";
import { database } from "@/firebase/config";
import CustomRadioGroup from "@/components/generic/CustomRadioGroup";
import {formatInTimeZone} from "date-fns-tz";
import {useList, useObject} from "react-firebase-hooks/database";
import UniqueChildren from "@/components/UniqueChildrenWrapper";
import CustomButtonGroup from "@/components/generic/CustomButtonGroup";
import Divider from "@/components/Divider";
import CustomDateTimeInput from "@/components/generic/CustomDateTimeInput";

export default function ProjectTransaction() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const path = usePathname();

  const [newModal, setNewModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [transactionData, setTransactionData] = useState({
    type: 'Expense',
    title: 'Select',
    detailsLabel: 'Details',
    details: '',
    amount: 0,
    date: format(new Date(), 'yyyy-MM-dd'),
    paymentType: 'notPaid'
  })
  const [fullPaymentData, setFullPaymentData] = useState({key: '', details: ''})

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'expense', label: 'Expense' },
    { value: 'payment', label: 'Payment' },
  ];
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
  const paymentTypeOptions = [
    { value: 'notPaid', label: 'Not Paid' },
    { value: 'full', label: 'Full' },
    { value: 'partial', label: 'Partial' },
  ];

  const titleOptions = transactionData.type == "Expense" ? expenseOptions : paymentOptions;
  const projectName: string = decodeURIComponent(path.substring(path.lastIndexOf("/") + 1));
  const [ data, dataLoading, errorData ] = useList(GetDatabaseReference(`transaction/project/${projectName}`));
  const total = GetTotalValue(data, "amount");
  const [ totalBalanceData ] = useObject(GetDatabaseReference(`balance/project/${projectName}`));
  const totalBalanceValue: number = totalBalanceData?.val().value;
  const totalBalanceDate: string = totalBalanceData?.val().date;
  const paidDataOptions = data?.filter(t=>t.val().amount < 0).map((item) => ({value: item.key!, label: `${item.val().date} ${item.val().title}${item.val().details ? `-${item.val().details}` : ''}: ${formatCurrency(item.val().amount)}`}));
  const [partialDataSets, setPartialDataSets] = useState([
    { id: 1, key: '', details: "", amount: 0 },
  ]);

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

  const updatePaymentData = (key: string, amount: number) => {
    const databaseRef = GetDatabaseReference(`transaction/project/${projectName}/${key}/data`);
    const updateData = {
      details: `${transactionData.title} - ${transactionData.details}`,
      amount: amount,
    }
    update(databaseRef, updateData)
      .catch((error) => console.warn(error.message))
  }

  const updatePartialPaymentData = async() => {
    partialDataSets.forEach((partialDataSet) => {
      if (partialDataSet.key && partialDataSet.key !== "Select" && partialDataSet.details !== "Select") {
        updatePaymentData(partialDataSet.key, partialDataSet.amount);
      }
    })
  }

  const handleTypeChange = (value: string) => {
    setTransactionData({...transactionData, type: value, title: 'Select', detailsLabel: 'Details', details: ''});
  }

  const handleTitleChange = (value: string, label:string) => {
    switch (label) {
        case "Cash":
          setTransactionData({...transactionData, detailsLabel: 'Receiver', details: ''});
          break;
        case "Cheque":
        case "Bank Transfer":
          setTransactionData({...transactionData, detailsLabel: 'Bank Name, Branch', details: ''});
          break;
        case "Account Transfer":
        case "CellFin (Account)":
          setTransactionData({...transactionData, detailsLabel: 'Account Number', details: 'Acc No.**'});
          break;
        case "bKash":
          setTransactionData({...transactionData, detailsLabel: 'bKash Number', details: ''});
          break;
        case "Servicing":
          setTransactionData({...transactionData, detailsLabel: 'Month', details: ''});
          break;
        case "Spare Parts":
          setTransactionData({...transactionData, detailsLabel: 'Name of Parts', details: ''});
          break;
        default:
          setTransactionData({...transactionData, detailsLabel: 'Details', details: ''});
          break;
    }
    setTransactionData({...transactionData, title: value});
  }

  const handleNewClick = () => {
    setTransactionData({...transactionData, type: 'Expense', title: 'Select', details: '', amount: 0, date: format(new Date(), 'yyyy-MM-dd'), paymentType: 'notPaid'});
    setNewModal(true)
  }

  const addPartialDataSet = () => {
    if (partialDataSets.length < 10) {
      setPartialDataSets((prev) => [
        ...prev,
        { id: prev.length + 1, key: "", details: "", amount: 0 },
      ]);
    }
  };

  const removePartialDataSet = (id: number) => {
    setPartialDataSets((prev) => prev.filter((set) => set.id !== id));
  };

  const handlePartialDataChange = (
    id: number,
    field: "details" | "key" | "amount",
    value: string
  ) => {
    setPartialDataSets((prev) =>
      prev.map((set) =>
        set.id === id ? { ...set, [field]: value } : set
      )
    );
  };

  const saveNewTransaction = () => {
    if (!transactionData.title || transactionData.title == "Select") {
        errorMessage(`Please select ${transactionData.type} type`)
    } else if (!transactionData.date) {
        errorMessage("Please select a valid date")
    } else if (transactionData.paymentType == "full" && (!fullPaymentData || !fullPaymentData.key || fullPaymentData.details === "Select" || fullPaymentData.details === "")) {
      errorMessage("Please select a valid payment date")
    } else {
      let paymentData = {}
      if (transactionData.paymentType == "full") {
        paymentData = {
          [fullPaymentData.key] : {
            details: fullPaymentData.details,
            amount: transactionData.amount,
          }
        }
      } else if (transactionData.paymentType == "partial") {
        paymentData = partialDataSets.reduce((partialDataObject, partialData) => {
          if (partialData.key && partialData.key !== "Select" && partialData.details !== "Select") {
            partialDataObject[partialData.key] = {
              amount: partialData.amount,
              details: partialData.details,
            };
          }
          return partialDataObject;
        }, {} as { [key: string]: { amount: number; details: string } });
      }
      const updatedData = {
        title: transactionData.title,
        details: transactionData.details,
        amount: transactionData.type == "Expense" ? transactionData.amount : transactionData.amount * (-1),
        date: format(parse(transactionData.date, "yyyy-MM-dd", new Date()), "dd.MM.yy"),
        data: paymentData
      }

      const newKey = push(child(ref(database), `transaction/project/${projectName}`)).key
      const newTransactionRef = `transaction/project/${projectName}/${format(parse(transactionData.date, "yyyy-MM-dd", new Date()), "yyMMdd")}${newKey}`;
      update(ref(database, newTransactionRef), updatedData)
        .then(() => {
          updateDate().catch((error) => {
            console.warn(error);
            errorMessage("Failed to update the last update date")
          });
          if (transactionData.paymentType == "full") {
            updatePaymentData(fullPaymentData.key, transactionData.amount)
          } else if (transactionData.paymentType == "partial") {
            updatePartialPaymentData()
              .catch((error) => {
                console.log(error);
                errorMessage("Failed to update payment data")
              });
          }
          successMessage("Saved the changes.")
        }).catch((error) => {
            console.error(error.message);
            errorMessage(error.message);
        }).finally(() => {
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
            <Button color={"blue"} onClick={handleNewClick}>
              <MdAddCircle className="mr-2 h-5 w-5"/>Add New Transaction
            </Button>

            <Divider orientation={`vertical`}/>

            <div className="flex items-center gap-x-2">
              <span>Filter by</span>
              <CustomButtonGroup options={filterOptions} onChange={(value) => setFilter(value)}/>
            </div>

            <div className={total != totalBalanceValue ? "" : "hidden"}>
              <Divider orientation={`vertical`}/>
            </div>

            <Button color="blue" className={total != totalBalanceValue ? "" : "hidden"} onClick={updateTotal}>
              Update Total Balance
            </Button>
          </div>

          <Modal show={newModal} size="3xl" popup onClose={() => setNewModal(false)} className="bg-black bg-opacity-50">
            <Modal.Header className="bg-slate-800 rounded-t-md text-white border-t border-x border-blue-500">
              <div className="text-xl font-medium text-white">New Transaction</div>
            </Modal.Header>
            <Modal.Body className="p-6 bg-slate-950 rounded-b-md border-b border-x border-blue-500">
                <CustomRadioGroup id={'transactionType'} options={transactionOptions}
                                  onChange={(value) => handleTypeChange(value)}
                                  defaultValue={transactionData.type}
                />

                <Divider className={`my-6`}/>

                <div className="flex items-center gap-x-2 -mt-2">
                  <CustomDropDown id="title" label={`${transactionData.type} Type`} options={titleOptions}
                                  className={`flex-[1_1_35%]`}
                                  onChange={(value, label) => handleTitleChange(value, label)}
                                  required={true}
                  />
                  <CustomInput id="details" type="text" label={transactionData.detailsLabel}
                               className={`flex-[1_1_65%]`}
                               value={transactionData.details}
                               onChange={(e) => setTransactionData({...transactionData, details: e.target.value})}
                  />
                </div>
                <div className="flex items-center gap-x-2">
                  <CustomInput id="amount" type="number" label="Amount" value={transactionData.amount}
                               className={`flex-[1_1_50%]`}
                               pre={`৳ ${transactionData.type == "Payment" ? "-" : ""}`}
                               onChange={(e) => setTransactionData({...transactionData, amount: Number(e.target.value)})}
                               required={true}
                  />
                  <CustomDateTimeInput id="date" type="date" label="Date"
                                       className={`flex-[1_1_50%]`}
                                       value={transactionData.date}
                                       onChange={(value) => setTransactionData({...transactionData, date: value})}
                                       required={true}
                  />
                </div>
                  {paidDataOptions && transactionData.type == "Expense" ?
                    <div>
                      <Divider className={`my-6`}/>
                      <CustomRadioGroup id={'paymentType'} options={paymentTypeOptions} className={`m-6`}
                                        onChange={(value) => setTransactionData({
                                          ...transactionData,
                                          paymentType: value
                                        })}
                                        defaultValue={transactionData.paymentType}
                      />
                      {
                        transactionData.paymentType == "full" ?
                          <CustomDropDown id="paymentDate" label={`Payment Date`} options={paidDataOptions}
                                          onChange={(value, label) => {
                                            setFullPaymentData({key: value, details: label})
                                          }}
                          />
                          : transactionData.paymentType == "partial" ?
                            <div>
                              {
                                partialDataSets.length < 10 && (
                                  <Button color="blue" onClick={addPartialDataSet} className={`mx-auto min-w-[30%]`}>Add</Button>
                                )
                              }
                              {
                                partialDataSets.map((set, index) => (
                                  <div key={set.id} className={`flex items-end gap-x-2`}>
                                    <CustomDropDown id={`paymentDate${index + 1}`} label={`Payment Date ${index + 1}`}
                                                    className={`flex-[1_1_75%]`} options={paidDataOptions}
                                                    onChange={(value, label) => {
                                                      handlePartialDataChange(set.id, "details", label);
                                                      handlePartialDataChange(set.id, "key", value);
                                                    }}
                                    />
                                      <CustomInput id={`paymentAmount${index + 1}`} label={`Amount ${index + 1}`}
                                                   type="number" pre={`৳`} className={`flex-[1_1_25%]`}
                                                   onChange={(e) => handlePartialDataChange(set.id, "amount", e.target.value)}
                                      />
                                      <Button color="failure" onClick={() => removePartialDataSet(set.id)}><MdDelete
                                        className={`w-5 h-5`}></MdDelete></Button>
                                  </div>
                                ))
                              }
                            </div>
                            : null
                      }
                      <Divider className={`my-6`}/>
                    </div> : null
                  }

                  <div className="flex gap-4 justify-center mt-4">
                    <Button color="blue" onClick={saveNewTransaction}>Save</Button>
                    <Button color="gray" onClick={() => setNewModal(false)}>Cancel</Button>
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
              ) : filter == "expense" ?
                  <UniqueChildren>
                    {
                      data.filter(transaction => transaction.val().amount >= 0).sort((a, b) => b.key!.localeCompare(a.key!)).map((item) => {
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
                : filter == "payment" ?
                  <UniqueChildren>
                    {
                      data.filter(transaction => transaction.val().amount < 0).sort((a, b) => b.key!.localeCompare(a.key!)).map((item) => {
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
                  :
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
            }
            <TotalBalance value={total} date={totalBalanceDate} update={total != totalBalanceValue} onClick={updateTotal}/>
          </div>
        </div>
      </Layout>
      );
  } else return <AccessDenied/>
}