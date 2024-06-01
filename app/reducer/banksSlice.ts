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
      if(!state.Bank) state.Bank = [];
      state.Bank.push(action.payload);
    },
    clearUser: (state) => {

    },
  },
});

export const { addCashFlow, clearUser } = banksSlice.actions;
export default banksSlice.reducer;
