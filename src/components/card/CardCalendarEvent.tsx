import {FC, useState} from 'react';
import {format} from "date-fns";
import {Badge, Button, Modal} from "flowbite-react";
import CustomInput from "@/components/generic/CustomInput";
import {remove, update} from "firebase/database";
import {GetDatabaseReference} from "@/firebase/database";
import {errorMessage, successMessage} from "@/utils/functions";
import {MdDelete, MdEditNote} from "react-icons/md";
import {HiOutlineExclamationCircle} from "react-icons/hi";
import CustomCheckbox from "@/components/generic/CustomCheckBox";

const CardCalendarEvent: FC<CalendarEventInterface & { id:string }> = ({
  id, title, details='', assigned='', start, end, allDay }) => {
  const [editEventModal, setEditEventModal] = useState(false);
  const [deleteEventModal, setDeleteEventModal] = useState(false);
  const [eventData, setEventData] = useState({title: title, details: details, assigned: assigned})

  const handleEditEvent = () => {
    if (eventData.title == "") {
      errorMessage("Title required!")
    } else {
      update(GetDatabaseReference(`calendar/${id}`), {
        title: eventData.title,
        details: eventData.details,
        assigned: eventData.assigned,
      }).then(() => {
        successMessage("Event added successfully.")
      }).catch((error) => {
        console.error(error);
        errorMessage("Error occurred!");
      })
    }
  }

  const handleEventDelete = () => {
    remove(GetDatabaseReference(`calendar/${id}`)).then(() => {
      successMessage("Deleted the event successfully.")
    }).catch ((error) => {
      errorMessage(error.message);
    }).finally(() => {
      setEditEventModal(false);
    })
  };

    return(
      <div className="flex w-full h-auto p-2 rounded-md bg-slate-700 text-left items-center space-x-1">
        <div className="flex-col -space-y-1 items-center border rounded-md p-1">
          <div className={"text-xl"}>{format(new Date(start), "dd")}</div>
          <div className={"text-xs"}>{format(new Date(start), "MMM")}</div>
        </div>

        <div className={`flex-auto`}>
          <div className="capitalize font-semibold">{title}</div>
          {details ? <p className='text'>{details}</p> : null}
          {assigned ? <p className='text-sm'>{assigned}</p> : null}
          <Badge className={`w-fit`}>{!allDay && end ? `${format(new Date(start), "dd.MM.yy HH:mm aa")} - ${format(new Date(end), "dd.MM.yy HH:mm aa")}` : "All Day"}</Badge>
        </div>

        <button
          className={"flex mx-2 p-2 bg-black bg-opacity-40 rounded-lg hover:bg-opacity-70"}
          onClick={() => setEditEventModal(true)}>
          <MdEditNote className='w-6 h-6'/>
        </button>
        <button className={"flex mr-2 p-2 bg-black bg-opacity-40 rounded-lg hover:bg-opacity-70"}
                onClick={() => setDeleteEventModal(true)}>
          <MdDelete className='w-6 h-6'/>
        </button>

        <Modal show={editEventModal} size="md" popup onClose={() => setEditEventModal(false)}
               className="bg-black bg-opacity-50">
          <Modal.Header className="bg-slate-800 rounded-t-md text-white border-t border-x border-blue-500">
            <div className="text-xl font-medium text-white">Edit Event</div>
          </Modal.Header>
          <Modal.Body className="bg-slate-950 rounded-b-md border-b border-x border-blue-500">
            <div className="space-y-4 pt-4">
              <CustomInput id="title" type="text" label={`Title`}
                           value={eventData.title}
                           onChange={(e) => setEventData({...eventData, title: e.target.value})}/>
              <CustomInput id="details" type="text" label={"Details"}
                           value={eventData.details}
                           onChange={(e) => setEventData({...eventData, details: e.target.value})}/>
              <CustomInput id="assigned" type="text" label={"Assign"}
                           value={eventData.assigned}
                           onChange={(e) => setEventData({...eventData, assigned: e.target.value})}/>
              <CustomCheckbox id="allDay" label={"All Day"} checked={allDay} disabled={true}/>
              <CustomInput id="assigned" type="text" label={"Start"}
                           value={ allDay ? format(new Date(start), "dd/MM/yyyy") : format(new Date(start), "dd/MM/yyyy HH:mm aa")}
                           disabled={true}/>
              { !allDay && end ?  (
                <CustomInput id="assigned" type="text" label={"End"} className={allDay ? "hidden" : ""}
                                                                       value={ allDay ? format(new Date(end), "dd/MM/yyyy") : format(new Date(end), "dd/MM/yyyy HH:mm aa")}
                                                                       disabled={true}/>
                ) : null
              }

              <div className="flex gap-4 justify-center">
                <Button color="blue" onClick={handleEditEvent}>Save</Button>
                <Button color="gray" onClick={() => setEditEventModal(false)}>Cancel</Button>
                <Button color={"failure"} onClick={handleEventDelete}>Delete</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <Modal show={deleteEventModal} size="md" onClose={() => setDeleteEventModal(false)} popup className="bg-black bg-opacity-50">
          <Modal.Header className="bg-red-800 rounded-t-md text-white border-t border-x border-blue-500">
            <div className="text-xl font-medium text-white">Delete Transaction</div>
          </Modal.Header>
          <Modal.Body className="bg-slate-950 rounded-b-md border-b border-x border-blue-500">
            <div className="text-center space-y-5 m-4">
              <HiOutlineExclamationCircle className="mx-auto h-14 w-14 text-gray-200" />
              <div className="text-lg text-gray-300">
                Are you sure you want to delete this event?
              </div>
              <div className="flex justify-center gap-4">
                <Button color={"failure"} onClick={handleEventDelete}>Delete</Button>
                <Button color={"gray"} onClick={() => setDeleteEventModal(false)}>Cancel</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

      </div>
    );
};

export default CardCalendarEvent;