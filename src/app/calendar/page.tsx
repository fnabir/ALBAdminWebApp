"use client"

import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {GenerateDatabaseKey, GetDatabaseReference} from "@/firebase/database";
import AccessDenied from "@/components/AccessDenied";
import {useList} from "react-firebase-hooks/database";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, {DateClickArg, EventResizeDoneArg} from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import {MdDownloading, MdError, MdInfo} from "react-icons/md";
import CardIcon from "@/components/card/CardIcon";
import {useEffect, useState} from "react";
import CardCalendarEvent from "@/components/card/CardCalendarEvent";
import {remove, update} from "firebase/database";
import {
  EventClickArg,
  EventDropArg,
} from '@fullcalendar/core'
import {Button, Modal} from "flowbite-react";
import CustomDropDown from "@/components/generic/CustomDropDown";
import CustomInput from "@/components/generic/CustomInput";
import CustomDateTimeInput from "@/components/generic/CustomDateTimeInput";
import CustomCheckbox from "@/components/generic/CustomCheckBox";
import {errorMessage, successMessage} from "@/utils/functions";
import {HiOutlineExclamationCircle} from "react-icons/hi";
import {format, parse} from "date-fns";
import UniqueChildren from "@/components/UniqueChildrenWrapper";

export default function Calendar() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [ eventsData, eventsLoading, eventsError] = useList(GetDatabaseReference("calendar"));
  const [ currentEvents, setCurrentEvents ] = useState<any>([]);
  const [ newEventModal, setNewEventModal ] = useState(false);
  const [ deleteEventModal, setDeleteEventModal ] = useState(false);
  const [ eventData, setEventData ] = useState({ id: '', title: '', details: '', assigned: '', start: new Date(), end: new Date(), allDay: false });
  const [inputStartDate, setInputStartDate] = useState('');
  const [inputStart, setInputStart] = useState('');
  const [inputEnd, setInputEnd] = useState('');

  const options = [
    { value: 'Servicing', label: 'Servicing' },
    { value: 'Callback', label: 'Callback'},
    { value: 'Others', label: 'Others'},
  ];

  interface FullCalendarEventInterface {
    id: string
    title: string
    start: string
    end?: string
    allDay: boolean
  }

  useEffect(() => {
    if (eventsData && !eventsLoading) {
      const firebaseEvents:any = eventsData.sort((a,b) => b.val().start - a.val().start).map((item) => {
        const snapshot = item.val();
        return {
          id: item.key,
          title: snapshot.title,
          start: snapshot.start,
          end: snapshot.end,
          allDay: snapshot.allDay,
        };
      });
      const removeDuplicateEvents = (events: FullCalendarEventInterface[]): FullCalendarEventInterface[] => {
        const seen = new Set<string>();
        return events.filter((event) => {
          if (seen.has(event.id)) {
            return false;
          }
          seen.add(event.id);
          return true;
        });
      };
      setCurrentEvents(removeDuplicateEvents(firebaseEvents).sort((a, b) => a.id.localeCompare(b.id)));
    }
  }, [eventsData, eventsLoading]);

  const handleDateClick = (info: DateClickArg) => {
    setEventData({ id: `${info.dateStr}${GenerateDatabaseKey("calendar")}`, title: '', details: '', assigned: '', start: info.date, end: info.date, allDay: false });
    setInputStartDate(info.dateStr);
    setInputStart(info.date.toISOString().slice(0, 16));
    setInputEnd(info.date.toISOString().slice(0, 16));
    setNewEventModal(true);
  }

  const handleNewEvent = () => {
    if (eventData.title == "") {
      errorMessage("Title required!")
    } else if (eventData.start == undefined) {
      errorMessage("Start date is required!")
    } else if (!eventData.allDay && eventData.end == undefined) {
      errorMessage("End date is required!")
    } else {
      update(GetDatabaseReference(`calendar/${eventData.id}`), {
        title: eventData.title,
        details: eventData.details,
        assigned: eventData.assigned,
        start: eventData.start.toISOString(),
        end: eventData.end.toISOString(),
        allDay: eventData.allDay,
      }).then(() => {
        setNewEventModal(false);
        successMessage("Event added successfully.")
      }).catch((error) => {
        console.error(error);
        errorMessage("Error occurred!");
      })
    }
  }

  const handleEventDelete = () => {
    remove(GetDatabaseReference(`calendar/${eventData.id}`)).then(() => {
      successMessage("Deleted the event successfully.")
    }).catch ((error) => {
      errorMessage(error.message);
    }).finally(() => {
      setDeleteEventModal(false);
    })
  };

  const handleEventClick = (info: EventClickArg) => {
    setEventData({ id: info.event.id, title: info.event.title, details: "", assigned: '', start: new Date(info.event.startStr), end: new Date(), allDay: false });
    setDeleteEventModal(true);
  }

  const handleEventDrop = (info: EventDropArg) => {
    update(GetDatabaseReference(`calendar/${info.event.id}`), {
      start: info.event.start!.toISOString(),
      end: info.event.end ? info.event.end.toISOString() : null,
    }).then(() => {
      successMessage("Event updated successfully.")
    }).catch((error) => {
      console.error(error);
      errorMessage("Error occurred!");
    })
  };

  const handleEventResize = (info: EventResizeDoneArg) => {
    update(GetDatabaseReference(`calendar/${info.event.id}`), {
      start: info.event.start!.toISOString(),
      end: info.event.end?.toISOString() || null,
    }).then(() => {
      successMessage("Event updated successfully.")
    }).catch((error) => {
      console.error(error);
      errorMessage("Error occurred!");
    })
  };

  if (loading) return <Loading/>

  if (!loading && !user) return router.push("/login")

  if (user.role == "admin" || user.role == "manager") {
    return (
      <Layout 
        pageTitle="Calendar | Asian Lift Bangladesh"
        headerTitle="Calendar">
        <div className="flex justify-between space-y-2 mt-2">
          <div className="flex-[1_1_25%] rounded-md">
            <h2 className={"text-xl font-semibold mb-2 text-center"}>Events</h2>
            <div className={"flex flex-col space-y-2"}>
              {
                eventsLoading ? (
                  <CardIcon title={"Loading"}>
                    <MdDownloading className='-ml-6 w-6 h-6 content-center'/>
                  </CardIcon>
                ) : eventsError ? (
                  <CardIcon title={"Error"} subtitle={eventsError.message}>
                    <MdError className='-ml-6 w-6 h-6 content-center'/>
                  </CardIcon>
                ) : eventsData && eventsData.length != 0 ? (
                  <UniqueChildren>
                    {(
                      eventsData.map((item) => {
                        const snapshot = item.val();
                        return (
                          <div key={item.key}>
                            <CardCalendarEvent id={item.key!} title={snapshot.title} details={snapshot.details} assigned={snapshot.assigned} start={snapshot.start} end={snapshot.end} allDay={snapshot.allDay}/>
                          </div>
                        )
                      })
                    )}
                  </UniqueChildren>
                ) : (
                  <CardIcon title={"No Events"}>
                    <MdInfo className='-ml-6 w-6 h-6 content-center'/>
                  </CardIcon>
                )
              }
            </div>
          </div>

          <div className="flex-[1_1_100%] px-4 rounded-md">
            <FullCalendar height={"75vh"}
                          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                          headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
                          }}
                          initialView="dayGridMonth"
                          editable={true}
                          selectable={true}
                          selectMirror={true}
                          dayMaxEvents={true}
                          events={currentEvents}
                          dateClick={handleDateClick}
                          eventClick={handleEventClick}
                          eventDrop={handleEventDrop}
                          eventResize={handleEventResize}
            />

            <Modal show={newEventModal} size="md" popup onClose={() => setNewEventModal(false)} className="bg-black bg-opacity-50">
              <Modal.Header className="bg-slate-800 rounded-t-md text-white border-t border-x border-blue-500">
                <div className="text-xl font-medium text-white">New Event</div>
              </Modal.Header>
              <Modal.Body className="bg-slate-950 rounded-b-md border-b border-x border-blue-500">
                <div className="space-y-4 pt-4">
                  <CustomDropDown id="title" label={`Title`} options={options}
                                  onChange={(value) => setEventData({ ...eventData, title: value })}/>
                  <CustomInput id="details" type="text" label={"Details"}
                               onChange={(e) => setEventData({ ...eventData, details: e.target.value })}/>
                  <CustomInput id="assigned" type="text" label={"Assign"}
                               onChange={(e) => setEventData({ ...eventData, assigned: e.target.value })}/>
                  <CustomCheckbox id="allDay" label={"All Day"} onChange={(value)=> setEventData({...eventData, allDay: value })}/>
                  {eventData.allDay ?
                    <CustomDateTimeInput id={"startDate"} label={"Start"} type={"date"}
                                         value={inputStartDate}
                                         onChange={(value) => {
                                           setInputStartDate(value);
                                           setEventData({ ...eventData, start: parse(value, "yyyy-MM-dd", new Date())})}
                                         }
                    /> : <div>
                      <CustomDateTimeInput id={"start"} label={"Start"} type={"datetime-local"}
                                           value={inputStart}
                                           onChange={(value) => {
                                             setInputStart(value)
                                             setEventData({ ...eventData, start: new Date(value)})}
                                           }
                      />
                      <CustomDateTimeInput id="end" label={"End"} type={"datetime-local"}
                                           value={inputEnd}
                                           onChange={(value) => {
                                             setInputEnd(value)
                                             setEventData({ ...eventData, end: new Date(value)})}
                                           }
                                           hidden={eventData?.allDay}
                      />
                    </div>
                  }

                  <div className="flex gap-4 justify-center">
                    <Button color="blue" onClick={handleNewEvent}>Save</Button>
                    <Button color="gray" onClick={() => setNewEventModal(false)}>Cancel</Button>
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
        </div>
      </Layout>
    );
  } else return <AccessDenied/>;
}
