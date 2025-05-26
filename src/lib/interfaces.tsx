import { DataSnapshot } from "firebase/database";
import { IconType } from "react-icons";

export interface SidebarItemInterface {
  label: string;
  href: string;
  icon?: IconType;
  isAdmin?: boolean;
}

export interface OptionsInterface {
  value: string;
  label?: string;
}
export interface BreadcrumbInterface {
  label: string;
  href?: string;
}

export interface BalanceInterface {
    type:string;
    id: string;
    name: string;
    value: number;
    date?: string;
    status?: string;
}

export interface TransactionInterface {
    type:string;
    uid: string;
    transactionId: string;
    title: string;
    details?: string;
    amount: number;
    date: string;
    access?:string;
}

export interface CallbackTotalInterface {
    id: string;
    name: string;
    value: number;
}

export interface OfferInterface {
    id: string;
    name: string;
    address?: string;
    product: string;
    work: string;
    unit?: string;
    floor?: string;
    shaft?: string;
    person?: string;
    note?: string;
    refer?:string;
    date?: string;
}

export interface ProjectTransactionInterface {
    id: string;
    title: string;
    details: string | undefined;
    amount: number;
    date: string;
    data: DataSnapshot | null;
}

export interface calendarEvent {
    id: string,
    title: string,
    details?: string,
    assigned?: string,
    start: string,
    end?: string,
    allDay: boolean,
}

export interface CallbackInterface {
    id: string;
    project: string;
    details: string;
    name: string;
    status: "Select" | "New" | "Assigned" | "In Progress" | "Fixed" | "Cannot be fixed" | undefined;
    date: string;
}

export interface ProjectInfoInterface {
    project: string;
    location: string;
    phone: string;
    contactName: string;
    status: string;
    servicing: number | undefined;
}

export interface PartialPaymentDataInterface {
    id: number;
    key: string;
    details: string;
    amount: number;
}

export interface FullPaymentDataInterface {
    key: string;
    details: string;
}