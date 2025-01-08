import {DataSnapshot} from "@firebase/database";

export type projectTransaction = {
    id: string,
    title: string,
    details: string | undefined,
    amount: number,
    date: string,
    data: DataSnapshot | null,
}

export type breadcrumbItem = {
    text: string,
    link?: string,
}

export type options = {
    value: string,
    label?: string,
}

export type calendarEvent = {
    id: string,
    title: string,
    details?: string,
    assigned?: string,
    start: string,
    end?: string,
    allDay: boolean,
}

export type callback = {
    id: string,
    project: string,
    details: string,
    name: string,
    status: "Select" | "New" | "Assigned" | "In Progress" | "Fixed" | "Cannot be fixed" | undefined,
    date: string,
}

export type projectInfo = {
    project: string,
    location: string,
    phone: string,
    contactName: string,
    status: string,
    servicing: number | undefined,
}