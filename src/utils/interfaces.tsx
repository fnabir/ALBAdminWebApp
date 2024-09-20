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

interface ProjectBalanceInterface {
    name: string
    value: number
    date?: string
    status?: string
}