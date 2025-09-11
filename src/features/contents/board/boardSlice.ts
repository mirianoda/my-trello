import { createSlice } from "@reduxjs/toolkit";
import type { Boards } from "../types";
import type { PayloadAction } from "@reduxjs/toolkit";

export const exampleBoardId = "example-board-1";
export const exampleListId = [
  "example-list-1",
  "example-list-2",
  "example-list-3",
];

const initialState: Boards = {
  [exampleBoardId]: {
    id: exampleBoardId,
    title: "My Board",
    lists: [exampleListId[0], exampleListId[1], exampleListId[2]],
  },
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    addListToBoard: (
      state,
      action: PayloadAction<{ boardId: string; listId: string }>
    ) => {
      state[action.payload.boardId].lists.push(action.payload.listId);
    },
    removeListFromBoard: (
      state,
      action: PayloadAction<{ boardId: string; listId: string }>
    ) => {
      const index = state[action.payload.boardId].lists.findIndex(
        (l) => l === action.payload.listId
      );
      state[action.payload.boardId].lists.splice(index, 1);
    },
    moveListIds: (
      state,
      action: PayloadAction<{ boardId: string; from: number; to: number }>
    ) => {
      const { boardId, from, to } = action.payload;
      const moveListId = state[boardId].lists.splice(from, 1)[0];
      state[boardId].lists.splice(to, 0, moveListId);
    },
  },
});

export const { addListToBoard, removeListFromBoard, moveListIds } =
  boardSlice.actions;
export default boardSlice.reducer;
