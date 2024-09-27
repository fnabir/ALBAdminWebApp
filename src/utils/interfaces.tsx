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
    name: string
    value: number
    date?: string
    status?: string
}

interface TransactionInterface {
    title: string
    amount: number
    date?: string
    details?: string
}