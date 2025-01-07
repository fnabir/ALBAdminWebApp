import {errorMessage, formatCurrency, successMessage} from "@/utils/functions";
import { MdDelete, MdEditNote } from "react-icons/md";
import { Modal } from "flowbite-react";
import { useState} from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import CustomInput from "@/components/generic/CustomInput";
import { Button } from "flowbite-react";
import {remove, update} from "firebase/database";
import {format, parse} from "date-fns";
import {formatInTimeZone} from "date-fns-tz";
import {GetDatabaseReference} from "@/firebase/database";
import CustomDateTimeInput from "@/components/generic/CustomDateTimeInput";


export default function CardTransaction(props:TransactionInterface) {
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const databaseRef = `transaction/${props.type}/${props.uid}/${props.transactionId}`;
    const [transactionData, setTransactionData] = useState({
        type: props.amount < 0 ? '-' : '+',
        title: props.title,
        details: props.details,
        amount: Math.abs(props.amount),
        date: format(parse(props.date, "yy.MM.dd", new Date()), 'yyyy-MM-dd'),
    })

    const updateDate = async() => {
        const today = new Date();
        const todayTZ = formatInTimeZone(today, 'Asia/Dhaka', 'dd MMM yyyy');
        const formattedDate = format(todayTZ, "dd MMM yyyy")

        update(GetDatabaseReference(`balance/total/${props.type}`), {
            date: formattedDate,
        }).catch((error) => {
            console.error(error.message);
            errorMessage(error.message);
        })

        update(GetDatabaseReference(`balance/${props.type}/${props.uid}`), {
            date: formattedDate,
        }).catch((error) => {
            console.error(error.message);
            errorMessage(error.message);
        })
    }

    const handleEdit = async () => {
        const updatedData = {
            title: transactionData.title,
            details: transactionData.details,
            amount: transactionData.type == "+" ? Math.abs(transactionData.amount) : Math.abs(transactionData.amount) * (-1),
        }
        if (props.title == "") {
            errorMessage("Please input title")
        } else if (props.title == updatedData.title && props.details == updatedData.details && updatedData.amount == props.amount) {
            setEditModal(false);
            successMessage("No changes has been made.")
        } else {
            update(GetDatabaseReference(databaseRef), updatedData)
            .then(() => {
                updateDate();
                setEditModal(false);
                successMessage("Saved the changes.")
            }).catch((error) => {
                console.error(error.message);
                errorMessage(error.message);
            }).finally(() => {
                setEditModal(false);
            })
        }
    };

    const handleDelete = () => {
        remove(GetDatabaseReference(databaseRef)).then(() => {
            setDeleteModal(false);
            successMessage("Deleted successfully.")
        }).catch ((error) => {
            setDeleteModal(false);
            errorMessage(error.message);
        })
    };

    return (
        <div className={`${props.amount > 0 ? 'bg-green-900' : 'bg-red-900'} rounded-lg shadow flex w-full p-1 text-start hover:bg-opacity-80 items-center`}>
            <div className="flex-col w-full items-center pl-2 md:pl-6 mr-1 md:pr-2">
                <div className="w-full mx-auto flex items-center justify-between text-white text-sm md:text-base gap-2 md:gap-6">
                    <div className="flex-wrap w-12 md:w-20">
                        {props.date}
                    </div>
                    <div className="flex-auto">
                        <div className="font-semibold">{`${props.title} ${props.details ? `- ${props.details}` : ''}`}</div>
                    </div>
                    <div className="flex-wrap items-center text-base md:text-2xl font-medium sm:mt-0">
                        {formatCurrency(props.amount)}
                    </div>
                </div>
            </div>
            <button className={"mx-2 p-2 bg-black bg-opacity-40 rounded-lg hover:bg-opacity-70 hidden md:block " + (props.access == "admin" ? "" : "hidden")}
                onClick={() => setEditModal(true)}>
                <MdEditNote className='w-6 h-6'/>
            </button>
            <button className={"mr-2 p-2 bg-black bg-opacity-40 rounded-lg hover:bg-opacity-70 hidden md:block"}
                onClick={() => setDeleteModal(true)}>
                <MdDelete className='w-6 h-6'/>
            </button>

            <Modal show={editModal} size="md" popup onClose={() => setEditModal(false)} className="bg-black bg-opacity-50">
                <Modal.Header className="bg-slate-800 rounded-t-md text-white border-t border-x border-blue-500">
                    <div className="text-xl font-medium text-white">Edit Transaction</div>
                </Modal.Header>
                <Modal.Body className="p-6 bg-slate-950 rounded-b-md border-b border-x border-blue-500">
                    <CustomInput id={'title'} type="text" label="Title"
                                 value={transactionData.title}
                                 onChange={(e) => setTransactionData({...transactionData, title: e.target.value})}
                                 color={transactionData.title ? "default" : "error"}
                                 helperText={!props.title ? "Please input title" : ""}
                                 required
                    />
                    <CustomInput id="details" type="text" label="Details"
                                 value={transactionData.details}
                                 onChange={(e) => setTransactionData({...transactionData, details: e.target.value})}
                    />
                    <CustomInput id="amount" type="number" label="Amount"
                                 value={transactionData.amount}
                                 pre={`৳ ${transactionData.type == "-" ? "-" : ""}`}
                                 onChange={(e) => setTransactionData({...transactionData, amount: Number(e.target.value)})}
                                 required/>
                    <CustomDateTimeInput id="date" type="date" label="Date"
                                         value={transactionData.date}
                                         onChange={(value) => setTransactionData({...transactionData, date: value})}
                                         helperText={"Date cannot be edited"} disabled
                    />
                    <div className="flex gap-4 justify-center mt-4">
                        <Button color="blue" onClick={handleEdit}>Save</Button>
                        <Button color="gray" onClick={() => setEditModal(false)}>Cancel</Button>
                    </div>
              </Modal.Body>
            </Modal>

            <Modal show={deleteModal} size="md" onClose={() => setDeleteModal(false)} popup className="bg-black bg-opacity-50">
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
                            <Button color={"failure"} onClick={handleDelete}>Delete</Button>
                            <Button color={"gray"} onClick={() => setDeleteModal(false)}>Cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            
        </div>
    )
}