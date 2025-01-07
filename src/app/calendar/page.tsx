"use client"

import Layout from "@/components/layout"
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, {DateClickArg, EventResizeDoneArg} from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import {Skeleton} from "@/components/ui/skeleton";
import {useList} from "react-firebase-hooks/database";
import {generateDatabaseKey, getDatabaseReference, showToast} from "@/lib/utils";
import CardIcon from "@/components/card/cardIcon";
import {MdError, MdInfo} from "react-icons/md";
import CardCalendarEvent from "@/components/card/cardCalendarEvent";
import {useEffect, useState} from "react";
import {calendarEvent} from "@/lib/types";
import {useForm} from "react-hook-form";
import {callbackSchema, EventFormData, eventSchema, TransactionFormData, transactionSchema} from "@/lib/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {format, parse} from "date-fns";
import {update} from "firebase/database";
import {EventDropArg} from "@fullcalendar/core";

export default function CalendarPage() {

	const [ eventsData, eventsLoading, eventsError] = useList(getDatabaseReference("calendar"));
	const [ currentEvents, setCurrentEvents ] = useState<calendarEvent[]>([]);
	const [ newEventModal, setNewEventModal ] = useState(false);
	const [ deleteEventModal, setDeleteEventModal ] = useState(false);

	const breadcrumb: {text: string, link?: string}[] = [
		{ text: "Home", link: "/" },
		{ text: "/" },
		{ text: "Calendar" },
	]

	const {
		register,
		getValues,
		setValue,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<EventFormData>({
		resolver: zodResolver(eventSchema),
	});

	const handleEventDrop = (info: EventDropArg) => {
		update(getDatabaseReference(`calendar/${info.event.id}`), {
			start: info.event.start!.toISOString(),
			end: info.event.end ? info.event.end.toISOString() : null,
			allDay: info.event.allDay,
		}).then(() => {

			showToast("Success", "Event updated successfully.");
		}).catch((error) => {
			console.error(error);
			showToast("Error", "Error occurred!");
		}).finally(() => {
			window.location.reload();
		})
	};

	const handleEventResize = (info: EventResizeDoneArg) => {
		update(getDatabaseReference(`calendar/${info.event.id}`), {
			start: info.event.start!.toISOString(),
			end: info.event.end?.toISOString() || null,
		}).then(() => {
			showToast("Success", "Event updated successfully.");
		}).catch((error) => {
			console.error(error);
			showToast("Error", "Error occurred!");
		}).finally(() => {
			window.location.reload();
		})
	};

	useEffect(() => {
		if (eventsData && !eventsLoading) {
			const firebaseEvents:calendarEvent[] = eventsData.sort((a,b) => b.val().start - a.val().start).map((item) => {
				const snapshot = item.val();
				return {
					id: item.key,
					title: snapshot.title,
					details: snapshot.details,
					assigned: snapshot.assigned,
					start: snapshot.start,
					end: snapshot.end,
					allDay: snapshot.allDay,
				} as calendarEvent;
			});
			setCurrentEvents(firebaseEvents.sort((a:calendarEvent, b:calendarEvent) => a.id.localeCompare(b.id)));
		}
	}, [eventsData, eventsLoading]);

	return (
		<Layout breadcrumb={breadcrumb}>
			<div className="flex justify-between space-y-2 mt-2">
				<div className="flex-[1_1_25%] rounded-md">
					<h2 className={"text-xl font-semibold mb-2 text-center"}>Events</h2>
					<div className={"flex flex-col space-y-2"}>
						{
							eventsLoading ?
								<div className="p-4 rounded-xl bg-muted/50">
									<Skeleton className="h-6 mb-2 w-1/5 rounded-xl"/>
									<Skeleton className="h-10 mb-1 w-1/2 rounded-xl"/>
									<Skeleton className="h-4 w-2/5 rounded-xl"/>
								</div>
							: eventsError ?
								<CardIcon title={"Error"} description={eventsError.message}>
									<MdError className='-ml-6 w-6 h-6 content-center'/>
								</CardIcon>
							: !eventsData ?
								<CardIcon title={"No events found"}>
									<MdInfo className='-ml-6 w-6 h-6 content-center'/>
								</CardIcon>
							:
								eventsData.map((item) => {
									const snapshot = item.val();
									return (
										<div key={item.key}>
											<CardCalendarEvent id={item.key!} title={snapshot.title} details={snapshot.details}
																				 assigned={snapshot.assigned} start={snapshot.start} end={snapshot.end}
																				 allDay={snapshot.allDay}/>
										</div>
									)
								})
						}
					</div>
				</div>

				<div className="flex-[1_1_75%] px-4 rounded-md">
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
												eventDrop={handleEventDrop}
												eventResize={handleEventResize}
					/>

				</div>
			</div>
		</Layout>
	)
}