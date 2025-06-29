"use client"

import Layout from "@/components/layout"
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, {DateClickArg, EventResizeDoneArg} from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import {Skeleton} from "@/components/ui/skeleton";
import {useList} from "react-firebase-hooks/database";
import {getDatabaseReference, showToast} from "@/lib/utils";
import CardIcon from "@/components/card/cardIcon";
import {MdError, MdInfo} from "react-icons/md";
import React, {useEffect, useState} from "react";
import {BreadcrumbInterface, CalendarEventInterface} from "@/lib/interfaces";
import {update} from "firebase/database";
import {EventDropArg} from "@fullcalendar/core";
import {useForm} from "react-hook-form";
import {EventFormData, EventFormSchema} from "@/lib/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import Checkbox from "@/components/generic/CheckBox";
import {addNewEvent} from "@/lib/functions";
import { InputDate } from "@/components/generic/InputDate";
import InputText from "@/components/generic/InputText";
import EventRow from "@/app/calendar/event-row";
import { Separator } from "@/components/ui/separator";

const breadcrumb: BreadcrumbInterface[] = [
  { label: "Home", href: "/" },
  { label: "Calendar" },
]

export default function CalendarPage() {
	const [dialog, setDialog] = useState<boolean>(false);
	const [ eventsData, eventsLoading, eventsError] = useList(getDatabaseReference("calendar"));
	const [ currentEvents, setCurrentEvents ] = useState<CalendarEventInterface[]>([]);
	const [allDayEvent, setAllDayEvent] = useState<boolean>(false);

	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<EventFormData>({
		resolver: zodResolver(EventFormSchema),
	});

	const onSubmit = (data: EventFormData) => {
		addNewEvent(data.start, {
			title: data.title,
			details: data.details,
			assigned: data.assigned,
			allDay: data.allDay,
			start: data.start,
			end: data.allDay ? "" : data.end,
		}).finally(() => {
			setDialog(false);
		})
	}

	const handleReset = () => {
		setAllDayEvent(false);
		reset();
	};

	const handleDateClick = (info: DateClickArg): void => {
		reset({
			start: info.date.toISOString().slice(0, 16),
			end: info.date.toISOString().slice(0, 16),
		});
		setDialog(true);
	}

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
			const firebaseEvents:CalendarEventInterface[] = eventsData.map((item) => {
				const snapshot = item.val();
				return {
					id: item.key,
					title: snapshot.title,
					details: snapshot.details,
					assigned: snapshot.assigned,
					start: snapshot.start,
					end: snapshot.end,
					allDay: snapshot.allDay,
				} as CalendarEventInterface;
			});
			setCurrentEvents(firebaseEvents);
		}
	}, [eventsData, eventsLoading]);

	return (
		<Layout breadcrumb={breadcrumb}>
			<div className="flex justify-between space-y-2 mt-2">
				<Dialog open={dialog} onOpenChange={setDialog}>
					<DialogContent className={"border border-blue-500"}>
						<DialogHeader>
							<DialogTitle>Add New Event</DialogTitle>
							<DialogDescription>
								Click update to save the changes.
							</DialogDescription>
						</DialogHeader>
						<Separator orientation={"horizontal"} className={"mb-2"}/>
						<form onSubmit={handleSubmit(onSubmit)}>
							<InputText label="Title"
                    {...register("title")}
                    error={errors.title?.message || ""}
              />
              <InputText label="Details"
                        {...register("details")}
                        error={errors.details?.message || ""}
              />
              <InputText label="Assigned"
                        {...register('assigned')}
                        error={errors.assigned?.message || ""}
              />
              <Checkbox id="allDay"
                        label="All day"
                        {...register("allDay")}
                        onChange={(e) => setAllDayEvent(e.target.checked)}
              />
              <InputDate type="datetime-local"
                        label="Start"
                        {...register('start')}
                        error={errors.start?.message || ""}
              />
              {
                !allDayEvent && <InputDate type="datetime-local"
                                          label="End"
                                          {...register('end')}
                                          error={errors.end?.message || ""}
                />
              }
							<DialogFooter className={"sm:justify-center pt-8"}>
								<DialogClose asChild>
									<Button type="button" size="lg" variant="secondary">
										Close
									</Button>
								</DialogClose>
								<Button type="button" size="lg" variant="secondary" onClick={handleReset}>Reset</Button>
								<Button type="submit" size="lg" variant="accent">Save</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
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
							: !eventsData || eventsData.length == 0 ?
								<CardIcon title={"No events found"}>
									<MdInfo className='-ml-6 w-6 h-6 content-center'/>
								</CardIcon>
							:
								eventsData.sort((a, b) => b.val().start.localeCompare(a.val().start)).map((item) => {
									const snapshot = item.val();
									return (
										<div key={item.key}>
											<EventRow id={item.key!} title={snapshot.title} details={snapshot.details}
																				 assigned={snapshot.assigned} start={snapshot.start} end={snapshot.end}
																				 allDay={snapshot.allDay}/>
										</div>
									)
								})
						}
					</div>
				</div>

				<div className="flex-[1_1_75%] px-4 rounded-md">
					<FullCalendar height={"80vh"}
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
												eventDrop={handleEventDrop}
												eventResize={handleEventResize}
					/>
				</div>
			</div>
		</Layout>
	)
}