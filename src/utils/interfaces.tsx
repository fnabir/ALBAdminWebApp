interface HeaderProps {
    title: string
    username: string
    email: string
}

interface TotalBalanceInterface {
    value: number
    date: string
    text?: string
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
    id: string
    title: string
    amount: number
    date?: string
    details?: string
}

interface CallbackTotalInterface {
    id: string
    name: string
    value: number
}

interface CallbackProjectInterface {
    id: string
    date: string
    details: number
    name: string
}