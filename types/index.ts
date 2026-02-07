export interface Transaction {
    id: string;
    amount: number;
    date: string;
    category: string;
    payee: string;
    type: 'income' | 'expense';
}

export interface Account {
    id: string;
    name: string;
    type: string;
    balance: number;
}
