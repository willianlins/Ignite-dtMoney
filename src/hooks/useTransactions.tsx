import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/api";



interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
}
interface TransactionsProviderProps {
  children: ReactNode;
}
type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

interface TransactionContextData{
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>;
}

const TransactionsContext = createContext<TransactionContextData>({} as TransactionContextData);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const requestTransactions = async () => {
      const response = await api.get<TransactionContextData>('transactions');

      setTransactions(response.data.transactions);
    }

    requestTransactions();
  }, []);

  async function createTransaction(transactionInput: TransactionInput) {
    const response = await api.post('/transactions', transactionInput);
    const { transaction } = response.data;

    setTransactions([
      ...transactions, 
      transaction
    ]);
  }

  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction}}>
      {children}
    </TransactionsContext.Provider>
  );
}


export function useTransactions(){
  const context = useContext(TransactionsContext);
  return context;
}
