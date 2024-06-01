import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Params {
  selectMonth: string | null;
  userName: string | null;
  dark: boolean | true;
  filterBy:string | "dateExp";
  

}

interface UserState {
  params: Params;
}

const initialState: Params = {
  dark:true,
  filterBy:"dateExp",
  selectMonth: new Date().getMonth().toString(),
  userName:""

};

const paramsSlice = createSlice({
  name: 'params',
  initialState,
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setSelectMonth:(state, action: PayloadAction<string>)=>{
      state.selectMonth = action.payload;

    },
    setFilterBy: (state, action: PayloadAction<string>) => {
      state.filterBy = action.payload;
    },
    setDark: (state, action: PayloadAction<boolean>) => {
      state.dark = action.payload;
    },
    clearUser: (state) => {
      state.dark = true;
      state.filterBy = "dateExp";
      state.selectMonth=new Date().getMonth().toString();
    },
  },
});

export const {setUserName, clearUser,setFilterBy, setDark, setSelectMonth} = paramsSlice.actions;
export default paramsSlice.reducer;
