export interface TransactionInterface {
    type:string
    uid: string
    transactionId: string
    title: string
    details?: string
    amount: number
    date: string
    access?:string
}

export interface CallbackTotalInterface {
    id: string
    name: string
    value: number
}

export interface OfferInterface {
    id: string
    name: string
    address?: string
    product: string
    work: string
    unit?: string
    floor?: string
    shaft?: string
    person?: string
    note?: string
    refer?:string
    date?: string
}