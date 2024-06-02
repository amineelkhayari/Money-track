import { createSlice, PayloadAction } from '@reduxjs/toolkit';



interface UserState {
  Bank: Bank[];
}

const initialState: UserState = {

  Bank: []
};

const banksSlice = createSlice({
  name: 'bank',
  initialState,
  reducers: {
    addCashFlow: (state, action: PayloadAction<Bank>) => {
      if (!state.Bank) state.Bank = [];
      state.Bank.push(action.payload);
    },
    deleteRecord: (state, action: PayloadAction<string>) => {
      const index = state.Bank.findIndex(bankExp => bankExp.transaction == action.payload.trim());
      if (index !== -1) {
        state.Bank.splice(index, 1);
      }
    },
    updateBank: (state, action: PayloadAction<Bank>) => {
      const index = state.Bank.findIndex(expense => expense.transaction === action.payload.transaction);
      if (index !== -1) {
          state.Bank[index] = action.payload;
          console.log(" is Updated : ",action.payload);
      }else {
        state.Bank.push(action.payload);
      }
    },
    clearBanks: (state) => {
      state.Bank = [];
    },
  },
});

export const { addCashFlow, clearBanks, deleteRecord,updateBank } = banksSlice.actions;
export default banksSlice.reducer;
