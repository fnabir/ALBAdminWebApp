import { GetDatabaseReference } from "@/firebase/database";
import { errorMessage, successMessage } from "@/utils/functions";
import { remove, update } from "firebase/database";
import {Badge, Button, Modal} from "flowbite-react";
import { FC, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { MdDelete, MdEditNote } from "react-icons/md";
import CustomInput from "@/components/generic/CustomInput";
import CustomDropDown from "@/components/generic/CustomDropDown";
import { CallbackStatusOptions } from "@/utils/arrays";
import CustomDateTimeInput from "../generic/CustomDateTimeInput";
import { format, parse } from "date-fns";

const CardCallbackProject: FC<CallbackProjectInterface & { id: string }> = ({
    id, name, details, status, date 
}) => {
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const databaseRef = `callback/${id}`;
  const [callbackData, setCallbackData] = useState<CallbackProjectInterface>({
    name: name,
    details: details,
    date: date,
    status: status
  });

  const updateCallback = () => {
    if (!callbackData || callbackData.details == "") {
      errorMessage("Please input details")
    } else {
      update(GetDatabaseReference(databaseRef), callbackData).then(() => {
        successMessage("Successfully updated offer.");
      }).catch((e) => {
        console.error(e);
        errorMessage(e.response.data);
      }).finally(() => {
        setEditModal(false);
      })
    }
  }

  const deleteCallback = () => {
    remove(GetDatabaseReference(databaseRef)).then(() => {
      successMessage("Deleted successfully.")
    }).catch ((error) => {
      errorMessage(error.message);
    }).finally(() => {
      setDeleteModal(false);
    })
  }

    return (
        <div className={"rounded-lg shadow hidden md:block sm:text-center md:text-start bg-slate-700 hover:bg-opacity-80"}>
            <div className="w-full mx-auto px-4 py-1 flex items-center justify-between text-white">
                <div className="flex-wrap w-20">
                    {date}
                </div>
                <div className="flex-auto">
                  <div className={`inline-flex items-center`}>
                    <div className={`font-semibold`}>{details}</div>
                    { status && status != "Select" ?
                      <Badge className={`ml-2`}
                             color={status == 'Cannot be fixed' ? "failure" :
                                    status == 'Fixed' ? "success" :
                                    status == 'In Progress' ? "warning" :
                                    status == 'Assigned' ? 'default' :
                                    status == 'New' ? 'indigo' : 'dark'}>
                        {status}
                      </Badge>
                      : null
                    }
                  </div>
                  <p className={`text-sm`}>{name}</p>
                </div>
                <button
                    className={"mx-2 p-2 bg-black bg-opacity-40 rounded-lg hover:bg-opacity-70 hidden md:block "}
                    onClick={() => setEditModal(true)}>
                    <MdEditNote className='w-6 h-6'/>
                </button>

                <Modal show={editModal} size="md" popup onClose={() => setEditModal(false)} className="bg-black bg-opacity-50">
                    <Modal.Header className="bg-slate-800 rounded-t-md text-white border-t border-x border-blue-500">
                        <div className="text-xl font-medium text-white">New Offer</div>
                    </Modal.Header>
                    <Modal.Body className="bg-slate-950 rounded-b-md border-b border-x border-blue-500">
                        <div>
                        <CustomInput id={"name"} type="text" label="Callback Details"
                                    value={callbackData.details}
                                    onChange={(e) => setCallbackData({...callbackData, details: e.target.value})}
                                    required={true}
                        />
                        <CustomInput id={"name"} type="text" label="Name"
                                    value={callbackData.name}
                                    onChange={(e) => setCallbackData({...callbackData, name: e.target.value})}
                        />
                        <CustomDropDown id="work" label={"Status"} options={CallbackStatusOptions}
                              value={callbackData.status}
                              onChange={(value) => setCallbackData({...callbackData, status: value})}
                        />
                        <CustomDateTimeInput id={"startDate"} label={"Start"} type={"date"}
                                         value={format(parse(date, 'dd.MM.yy', new Date()), "yyyy-MM-dd")}
                                         onChange={(value) => setCallbackData({ ...callbackData, date: format(parse(value, "yyyy-MM-dd", new Date()), "dd.MM.yy")})}
                        />
                        <div className="flex mt-4 gap-4 justify-center">
                            <Button color="blue" onClick={updateCallback}>Save</Button>
                            <Button color="gray" onClick={() => setEditModal(false)}>Cancel</Button>
                        </div>
                        </div>
                    </Modal.Body>
                    </Modal>

                <button className={"mr-2 p-2 bg-black bg-opacity-40 rounded-lg hover:bg-opacity-70 hidden md:block"}
                        onClick={() => setDeleteModal(true)}>
                    <MdDelete className='w-6 h-6'/>
                </button>

                <Modal show={deleteModal} size="md" onClose={() => setDeleteModal(false)} popup className="bg-black bg-opacity-50">
                    <Modal.Header className="bg-red-800 rounded-t-md text-white border-t border-x border-blue-500">
                        <div className="text-xl font-medium text-white">Delete Transaction</div>
                    </Modal.Header>
                    <Modal.Body className="bg-slate-950 rounded-b-md border-b border-x border-blue-500">
                        <div className="text-center space-y-5 m-4">
                        <HiOutlineExclamationCircle className="mx-auto h-14 w-14 text-gray-200" />
                        <div className="text-lg text-gray-300">
                            Are you sure you want to delete this callback record?
                        </div>
                        <div className="flex justify-center gap-4">
                            <Button color={"failure"} onClick={deleteCallback}>Delete</Button>
                            <Button color={"gray"} onClick={() => setDeleteModal(false)}>Cancel</Button>
                        </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    )
}

export default CardCallbackProject;