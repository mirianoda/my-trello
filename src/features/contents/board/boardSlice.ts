import { createSlice } from "@reduxjs/toolkit";
import type { Boards } from "../types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { addBoard } from "./boardThunks";

interface Board {
  id: string;
  title: string;
  ownerId: string;
  members: string[];
  createdAt: string;
}

interface BoardsState {
  boards: Boards;
  isLoading: boolean;
}

const initialState: BoardsState = { boards: {}, isLoading: true };

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    optimisticAddBoard: (state, action: PayloadAction<Board>) => {
      const newBoard = action.payload;
      state.boards[newBoard.id] = { ...newBoard, lists: [] };
    },
    optimisticRemoveBoard: (
      state,
      action: PayloadAction<{ boardId: string }>
    ) => {
      delete state.boards[action.payload.boardId];
    },
    setBoards: (state, action: PayloadAction<Boards>) => {
      state.boards = action.payload;
      state.isLoading = false;
    },
    resetBoards: (state) => {
      state.boards = {};
      state.isLoading = true;
    },
    addListToBoard: (
      state,
      action: PayloadAction<{ boardId: string; listId: string }>
    ) => {
      state.boards[action.payload.boardId].lists.push(action.payload.listId);
    },
    removeListFromBoard: (
      state,
      action: PayloadAction<{ boardId: string; listId: string }>
    ) => {
      const index = state.boards[action.payload.boardId].lists.findIndex(
        (l) => l === action.payload.listId
      );
      state.boards[action.payload.boardId].lists.splice(index, 1);
    },
    moveListIds: (
      state,
      action: PayloadAction<{ boardId: string; from: number; to: number }>
    ) => {
      const { boardId, from, to } = action.payload;
      const moveListId = state.boards[boardId].lists.splice(from, 1)[0];
      state.boards[boardId].lists.splice(to, 0, moveListId);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addBoard.rejected, (state, action) => {
      console.error(action.payload);
      state.isLoading = false;
    });
  },
});

export const {
  optimisticAddBoard,
  optimisticRemoveBoard,
  setBoards,
  resetBoards,
  addListToBoard,
  removeListFromBoard,
  moveListIds,
} = boardSlice.actions;
export default boardSlice.reducer;
