import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  signupData: null,
  loading: false,
  token: localStorage.getItem("expenseToken") ? JSON.parse(localStorage.getItem("expenseToken")) : null,
  isGrpReq : false,
};


const authSlice = createSlice({
    name:"auth",
    initialState: initialState,
    reducers: {
      setSignupData(state, value) {
        state.signupData = value.payload;
      },
      setLoading(state, value) {
        state.loading = value.payload;
      },
      setToken(state, value) {
        state.token = value.payload;
      },
      setIsGrpReq(state, value){
        state.isGrpReq = value.payload;
        //console.log("Is Group Request in slice : ", state.isGrpReq);
      }
    },
});

export const {setSignupData, setLoading, setToken, setIsGrpReq} = authSlice.actions;
export default authSlice.reducer;