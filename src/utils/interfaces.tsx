interface HeaderProps {
    title: string
    username: string
    email: string
}

interface BalanceInterface {
    type:string
    id: string
    name: string
    value: number
    date?: string
    status?: string
}

interface TransactionInterface {
    type:string
    uid: string
    transactionId: string
    title: string
    details?: string
    amount: number
    date: string
    access?:string
}

interface CallbackTotalInterface {
    id: string
    name: string
    value: number
}

interface CallbackProjectInterface {
    date: string
    details: string
    name: string
    status?: string
}

interface OfferInterface {
    id?: string
    name: string
    address?: string
    product?: string
    work: string
    unit?: string
    floor?: string
    shaft?: string
    person?: string
    note?: string
    refer?:string
    date?: string
    uid?: string
}

interface UserInfoInterface {
    name: string
    phone: string
    role: number
    roll?: string
    version?: string
}

interface CalendarEventInterface {
    title: string
    details?: string
    assigned?: string
    start: string
    end?: string
    allDay: boolean
}