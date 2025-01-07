import {errorMessage, formatCurrency, removeDuplicateData, successMessage} from "@/utils/functions";
import { MdDelete, MdEditNote } from "react-icons/md";
import { Modal } from "flowbite-react";
import { useState} from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import CustomInput from "@/components/generic/CustomInput";
import { Button } from "flowbite-react";
import {remove, update} from "firebase/database";
import {format, parse} from "date-fns";
import {useList, useListKeys} from "react-firebase-hooks/database";
import {GetDatabaseReference, GetTotalValue} from "@/firebase/database";
import UniqueChildren from "@/components/UniqueChildrenWrapper";
import CustomRadioGroup from "@/components/generic/CustomRadioGroup";
import CustomDateTimeInput from "@/components/generic/CustomDateTimeInput";
import Divider from "@/components/Divider";
import CustomDropDown from "@/components/generic/CustomDropDown";
import {
    paymentDataCleanup,
    updateDate,
    updatePartialPaymentData,
    updatePaymentData
} from "@/app/project/[id]/functions";
import {PaymentTypeOptions} from "@/utils/arrays";

interface Props {
    projectName: string,
    transactionId: string,
    title: string,
    details?: string,
    amount: number,
    date: string,
    userAccess: string,
    paidDataOptions?:{value:string, label:string}[]
}

const CardTransactionProject: React.FC<Props> = ({
    projectName, transactionId, title, details, amount, date, userAccess, paidDataOptions
}) => {
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const databaseRef = `transaction/project/${projectName}/${transactionId}`;
    const [data] =  useList(GetDatabaseReference(`${databaseRef}/data`));
    const [dataKeys] = useListKeys(GetDatabaseReference(`${databaseRef}/data`));
    const total = GetTotalValue(data, "amount");
    const bg = amount <= 0 || amount == total? 'bg-green-900' : amount > 0 ? amount < total ? 'bg-amber-900' : 'bg-red-900' : 'bg-slate-700';

    const [transactionData, setTransactionData] = useState({
        type: amount < 0 ? 'payment' : 'expense',
        title: title,
        details: details,
        amount: Math.abs(amount),
        date: format(parse(date, "yy.MM.dd", new Date()), 'yyyy-MM-dd'),
        paymentType: !data || data.length == 0 ? 'notPaid' : ((data.length == 1 && amount <= total) ? 'full' : 'partial')
    })

    const [fullPaymentData, setFullPaymentData] = useState({key: '', details: ''})
    const [partialDataSets, setPartialDataSets] = useState([
        { id: 1, key: '', details: "", amount: 0 },
    ]);

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

    const handleEditClick = () => {
        if (transactionData.type === "expense") {
            if (!data || data.length == 0) {
                setTransactionData({...transactionData, paymentType: 'notPaid'});
            } else if (data.length == 1 && total >= transactionData.amount) {
                setTransactionData({...transactionData, paymentType: 'full'});
                data.map((item) => {
                    setFullPaymentData({key: item.key!, details: item.val().details})
                })
            } else {
                setTransactionData({...transactionData, paymentType: 'partial'});
                data.map((item, index) => {
                    if (partialDataSets.length  < index +1 ) addPartialDataSet();
                    handlePartialDataChange(index + 1, "key", item.key!);
                    handlePartialDataChange(index + 1, "details", item.val().details);
                    handlePartialDataChange(index + 1, "amount", item.val().amount);
                })
            }
        }
        setEditModal(true)
    }

    const updateTransaction = async() => {
        const updatedData = {
            title: transactionData.title,
            details: transactionData.details,
            amount: transactionData.type == "expense" ? Math.abs(transactionData.amount) : Math.abs(transactionData.amount) * (-1),
        }
        if (transactionData.title == "") {
            errorMessage("Please input title")
        } else {
            setUpdating(true);
            update(GetDatabaseReference(databaseRef), updatedData)
            .then(async () => {
                await updateDate(projectName);
                if (transactionData.type === "expense") {
                    if (transactionData.paymentType === "full") await updatePaymentData(projectName, transactionId, transactionData, fullPaymentData.key, fullPaymentData.details, transactionData.amount);
                    else if (transactionData.paymentType === "partial") await updatePartialPaymentData(projectName, transactionId, transactionData, partialDataSets);
                }
                await paymentDataCleanup(projectName, transactionId, transactionData, fullPaymentData, partialDataSets, dataKeys);
                successMessage("Saved the changes.")
            }).catch((error) => {
                console.error(error.message);
                errorMessage(error.message);
            }).finally(() => {
                setUpdating(false);
                setEditModal(false);
            })
        }
    };

    const deleteTransaction = () => {
        setDeleting(true);
        remove(GetDatabaseReference(databaseRef)).then(() => {
            if (dataKeys) {
                dataKeys.forEach(async (key) => {
                    remove(GetDatabaseReference(`transaction/project/${projectName}/${key}/data/${transactionId}`))
                      .catch((error) => console.error(error.message))
                })
            }
            successMessage("Deleted successfully.")
        }).catch ((error) => {
            errorMessage(error.message);
        }).finally(() => {
            setDeleting(false);
            setDeleteModal(false);
        })
    };

    return (
        <div className={"rounded-lg shadow flex w-full p-1 text-start " + bg + " hover:bg-opacity-80 items-center"}>
            <div className="flex-col w-full items-center pl-2 md:pl-6 mr-1 md:pr-2">
                <div className="w-full mx-auto flex items-center justify-between text-white text-sm md:text-base gap-2 md:gap-6">
                    <div className="flex-wrap w-12 md:w-20">
                        {date}
                    </div>
                    <div className="flex-auto">
                        <div className="font-semibold">{`${title} ${details ? `- ${details}` : ''}`}</div>
                    </div>
                    <div className="flex-wrap items-center text-base md:text-2xl font-medium sm:mt-0">
                        {formatCurrency(amount)}
                    </div>
                </div>
                <div className={"border-0 bg-black rounded-md bg-opacity-50"}>
                    {
                        data && <UniqueChildren>
                            {
                                data.sort((a, b) => b.key!.localeCompare(a.key!)).map((item) => {
                                    const snapshot = item.val();
                                    return (
                                        <div className="w-full flex justify-between px-2 text-sm pt-1" key={item.key}>
                                            <div className="flex-wrap w-[6rem]">{(snapshot.details).substring(0, 8)}</div>
                                            <div className="flex-auto">{(snapshot.details).substring(8,)}</div>
                                            <div className="flex-wrap">{formatCurrency(snapshot.amount)}</div>
                                        </div>
                                    )
                                })
                            }
                        </UniqueChildren>
                    }
                </div>
            </div>
            <button className={"mx-2 p-2 bg-black bg-opacity-40 rounded-lg hover:bg-opacity-70 hidden md:block " + (userAccess == "admin" ? "" : "hidden")}
                onClick={handleEditClick}>
                <MdEditNote className='w-6 h-6'/>
            </button>
            <button className={"mr-2 p-2 bg-black bg-opacity-40 rounded-lg hover:bg-opacity-70 hidden md:block"}
                onClick={() => setDeleteModal(true)}>
                <MdDelete className='w-6 h-6'/>
            </button>

            <Modal show={editModal} size="2xl" popup onClose={() => setEditModal(false)} className="bg-black bg-opacity-50">
                <Modal.Header className="bg-slate-800 rounded-t-md text-white border-t border-x border-blue-500">
                    <div className="text-xl font-medium text-white">Edit Transaction</div>
                </Modal.Header>
                <Modal.Body className="p-6 bg-slate-950 rounded-b-md border-b border-x border-blue-500">
                    <div className="flex items-center gap-x-2 -mt-2">
                        <CustomInput id={'title'} type="text" label="Title"
                                     className={`flex-[1_1_35%]`}
                                     value={transactionData.title}
                                     onChange={(e) => setTransactionData({...transactionData, title: e.target.value})}
                                     color={transactionData.title ? "default" : "error"}
                                     helperText={!transactionData.title ? "Please input title" : ""}
                                     required
                        />
                        <CustomInput id="details" type="text" label="Details"
                                     className={`flex-[1_1_65%]`}
                                     value={transactionData.details}
                                     onChange={(e) => setTransactionData({...transactionData, details: e.target.value})}
                        />
                    </div>
                    <div className="flex items-start gap-x-2">
                        <CustomInput id="amount" type="number" label="Amount"
                                     className={`flex-[1_1_50%]`}
                                     value={transactionData.amount}
                                     pre={`৳ ${transactionData.type == "payment" ? "-" : ""}`}
                                     onChange={(e) => setTransactionData({...transactionData, amount: Number(e.target.value)})}
                                     required/>
                        <CustomDateTimeInput id="date" type="date" label="Date"
                                             className={`flex-[1_1_50%]`}
                                             value={transactionData.date}
                                             onChange={(value) => setTransactionData({...transactionData, date: value})}
                                             helperText={"Date cannot be edited"} disabled
                        />
                    </div>

                    {
                        transactionData.type == "expense" ?
                          <div>
                              <Divider className={`my-6`}/>
                              <CustomRadioGroup id={'paymentType'} options={PaymentTypeOptions} className={`m-6`}
                                                onChange={(value) => setTransactionData({...transactionData, paymentType: value})}
                                                defaultValue={transactionData.paymentType}
                              />
                              {
                                  transactionData.paymentType == 'full' ?
                                    <CustomDropDown id="paymentDate" label={`Payment Date`} options={paidDataOptions? paidDataOptions : []}
                                                    value={fullPaymentData.key}
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
                                                    <CustomDropDown id={`paymentDate${index + 1}`} label={`Payment Date ${set.id}`}
                                                                    className={`flex-[1_1_75%]`} options={paidDataOptions? paidDataOptions : []}
                                                                    value={partialDataSets[index].key}
                                                                    onChange={(value, label) => {
                                                                        handlePartialDataChange(set.id, "details", label);
                                                                        handlePartialDataChange(set.id, "key", value);
                                                                    }}
                                                    />
                                                    <CustomInput id={`paymentAmount${index + 1}`} label={`Amount ${index + 1}`}
                                                                 type="number" pre={`৳`} className={`flex-[1_1_25%]`}
                                                                 value={partialDataSets[index].amount}
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
                          </div>
                        : null
                    }

                      <div className="flex gap-4 justify-center mt-4">
                          <Button color="blue" isProcessing={updating} onClick={updateTransaction}>Save</Button>
                          <Button color="gray" onClick={() => setEditModal(false)}>Cancel</Button>
                      </div>
                  </Modal.Body>
                </Modal>

                <Modal show={deleteModal} size="md" onClose={() => setDeleteModal(false)} popup
                       className="bg-black bg-opacity-50">
                    <Modal.Header className="bg-red-800 rounded-t-md text-white border-t border-x border-blue-500">
                        <div className="text-xl font-medium text-white">Delete Transaction</div>
                    </Modal.Header>
                    <Modal.Body className="bg-slate-950 rounded-b-md border-b border-x border-blue-500">
                        <div className="text-center space-y-5 m-4">
                            <HiOutlineExclamationCircle className="mx-auto h-14 w-14 text-gray-200" />
                        <div className="text-lg text-gray-300">
                            Are you sure you want to delete this transaction?
                        </div>
                        <div className="flex justify-center gap-4">
                            <Button color={"failure"} isProcessing={deleting} onClick={deleteTransaction}>Delete</Button>
                            <Button color={"gray"} onClick={() => setDeleteModal(false)}>Cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            
        </div>
    )
}

export default CardTransactionProject;