import { useGetObjectDataWithTotal} from "@/firebase/database";
import { errorMessage, formatCurrency, successMessage } from "@/utils/functions";
import { MdDelete, MdEditNote } from "react-icons/md";
import { Modal } from "flowbite-react";
import { useState} from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Input from "../generic/Input";
import { Button } from "flowbite-react";
import {child, ref, remove, update} from "firebase/database";
import { database } from "@/firebase/config";
import { format } from "date-fns";
import { TZDate } from "@date-fns/tz";


export default function CardTransaction(props:TransactionInterface) {
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const [inputTitle, setInputTitle] = useState(props.title);
    const [inputDetails, setInputDetails] = useState(props.details);
    const [inputAmount, setInputAmount] = useState(Math.abs(props.amount));
    const inputAmountType = props.amount < 0 ? "-" : "+";
    const [date, month, year] = props.date.split('.');
    const [inputDate, setInputDate] = useState(format(new Date(2000+Number(year), Number(month), Number(date)), 'yyyy-MM-dd'));
    const detailsText = props.details;
    const databaseRef = `transaction/${props.type}/${props.uid}/${props.transactionId}`;
    const {data, total} =  useGetObjectDataWithTotal(`${databaseRef}/data`);
    const bg = props.amount <= 0 || props.amount == total? 'bg-green-900' : props.amount > 0 ? props.amount < total ? 'bg-amber-900' : 'bg-red-900' : 'bg-slate-700';

    const updateDate = async() => {
        const today = new Date();
        const todayTZ = new TZDate(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), "Asia/Dhaka");
        const formattedDate = format(todayTZ, "dd MMM yyyy")

        update(ref(database, `balance/total/${props.type}`), {
            date: formattedDate,
        }).catch((error) => {
                console.error(error.message);
                errorMessage(error.message);
            })

        update(ref(database, `balance/${props.type}/${props.uid}`), {
            date: formattedDate,
        }).catch((error) => {
            console.error(error.message);
            errorMessage(error.message);
        })
    }

    const handleEdit = async () => {
        const updatedData = {
            title: inputTitle,
            details: inputDetails,
            amount: inputAmountType == "+" ? Math.abs(inputAmount) : Math.abs(inputAmount) * (-1),
        }
        if (props.title == "") {
            errorMessage("Please input title")
        } else if (props.title == updatedData.title && props.details == updatedData.details && updatedData.amount == props.amount) {
            setEditModal(false);
            successMessage("No changes has been made.")
        } else {
            update(ref(database, databaseRef), updatedData)
                .then(() => {
                    setEditModal(false);
                    updateDate();
                    successMessage("Saved the changes.")
                    window.location.reload();
                })
                .catch((error) => {
                    console.error(error.message);
                    errorMessage(error.message);
                })

        }
    };

    const handleDelete = () => {
        remove(child(ref(database), databaseRef)).then(() => {
            setDeleteModal(false);
            successMessage("Deleted successfully.")
            window.location.reload();
        }).catch ((error) => {
            setDeleteModal(false);
            errorMessage(error.message);
        })
    };

    return (
        <div className={"rounded-lg shadow flex w-full p-1 text-start " + bg + " hover:bg-opacity-80 items-center"}>
            <div className="flex-col w-full items-center pl-2 md:pl-6 mr-1 md:pr-2">
                <div className="w-full mx-auto flex items-center justify-between text-white text-sm md:text-base gap-2 md:gap-6">
                    <div className="flex-wrap w-12 md:w-20">
                        {props.date}
                    </div>
                    <div className="flex-auto">
                        <div className="font-semibold">{detailsText == "" || detailsText == undefined? props.title : `${props.title} - ${detailsText}`}</div>
                    </div>
                    <div className="flex flex-wrap items-center text-base md:text-2xl font-medium sm:mt-0">
                        {formatCurrency(props.amount)}
                    </div>
                </div>
                <div className={"border-0 bg-black rounded-md bg-opacity-50"}>
                    { data.sort((a, b) => b.key.localeCompare(a.key)).map((item) =>
                        (
                            <div className="w-full flex justify-between px-2 text-sm pt-1" key={item.key}>
                                <div className="flex-wrap w-[5.5rem]">{(item.details).substring(0, 8)}</div>
                                <div className="flex-auto">{(item.details).substring(8, )}</div>
                                <div className="flex flex-wrap">{formatCurrency(item.amount)}</div>
                            </div>
                        )
                    )}
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
                    <h3 className="text-xl font-medium text-white">Edit Transaction</h3>
                </Modal.Header>
                <Modal.Body className="bg-slate-950 rounded-b-md border-b border-x border-blue-500">
                    <form className="space-y-4">
                        <Input type="text" label="Title"
                               value={inputTitle}
                               onChange={(e) => setInputTitle(e.target.value)}
                               color={inputTitle == "" ? "error" : "default"} helperText={"Required"}
                               required
                        />
                        <Input type="text" label="Details"
                               value={inputDetails}
                               onChange={(e) => setInputDetails(e.target.value)}
                               color={"default"} helperText={""}
                        />
                        <Input label="Amount" value={String(inputAmount)} type="number" pre={`৳ ${inputAmountType == "-" ? "-" : ""}`}
                               onChange={(e) => setInputAmount(Number(e.target.value))} required/>
                        <Input label="Date" value={(inputDate)} type="date" disabled
                               onChange={(e) => setInputDate(e.target.value)}
                               helperText={"Date cannot be edited"}/>

                        <div className="flex gap-4 justify-center">
                            <Button color="blue" onClick={handleEdit}>Save</Button>
                            <Button color="gray" onClick={() => setEditModal(false)}>Cancel</Button>
                        </div>
                    </form>
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