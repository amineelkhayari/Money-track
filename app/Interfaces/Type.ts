type Participants = {
    ID: number,
    Value: string,
    checked: boolean,
    Payed: boolean
  }

  type Expense = {
    amount: number,
    description: string,
    dateExp:string,
    timeExp:string,
    transaction: string,
    paidBy: string,
    cat: string,
    participants: Participants[],
    sync:boolean,
    createdAt: Date
  }

  type GetExpense = {
    id:string,
    amount: number,
    description: string,
    dateExp:string,
    timeExp:string,
    cat:string,
    transaction: string,
    paidBy: string,
    participants: Participants[]
  }

  type ExpenseCreadit = {
    amount: number,
    description: string,
    dateExp:string,
    timeExp:string,
    transaction: string,
    cat:string,
    paidBy: string,
    participants: Participants[],
    sync: boolean,
    partName: string,
    createdAt: Date
  }
  
  interface GroupedData {
    date: string;
    data: ExpenseCreadit[];
    exp?: any
  }
  interface Bank {
    amount: number,
    motif: string  | null,
    cat: string | null,
    dateExp:string | null,
    timeExp:string | null ,
    transaction: string | null,
    user: string | null,
    sync:boolean | true,
    createdAt: Date 
  }
  interface groupeBank {
    date: string;
    data: Bank[];
    exp?: any
  }
  