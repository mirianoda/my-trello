import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Session } from "../types";

const initialState: Session = {
  currentBoardId: "",
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    selectBoard: (state, action: PayloadAction<{ boardId: string }>) => {
      state.currentBoardId = action.payload.boardId;
    },
  },
});

export const { selectBoard } = sessionSlice.actions;
export default sessionSlice.reducer;
