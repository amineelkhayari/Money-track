import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { number } from 'prop-types';



interface ExpensesState {
  expenses: Expense[];
}

const initialState: ExpensesState = {
  expenses: [],
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<Expense>) => {
        if(!state.expenses) state.expenses = [];
      state.expenses.push(action.payload);
      //console.log("when add",state.expenses);
    }, // add new data
    setExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.expenses = action.payload;
      console.log("set ",state.expenses);
    },// update all data
    updateExpense: (state, action: PayloadAction<Expense>) => {

        const index = state.expenses.findIndex(expense => expense.transaction === action.payload.transaction);
        console.log(action.payload, 'Data is set');
        if (index !== -1) {
            state.expenses[index] = action.payload;
            console.log(" is Updated : ",action.payload);
        }else {
          state.expenses.push(action.payload);
        }
    }, // update single data
    deleteExpense: (state, action: PayloadAction<string>) => {
      const index = state.expenses.findIndex(expense => expense.transaction == action.payload.trim());

      if (index !== -1) {
          state.expenses.splice(index,1);
          console.log(" is deleted : ",action.payload);
      }
  }, // delete single data
    resetExpenses: (state) => {
        state.expenses = [];
        console.log("set ",state.expenses);
      }, // clear all data offline
  },
});

export const { addExpense, setExpenses,resetExpenses,updateExpense,deleteExpense } = expensesSlice.actions;
export default expensesSlice.reducer;
