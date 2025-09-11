import { createSlice } from "@reduxjs/toolkit";
import type { Lists } from "../types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { exampleListId } from "../board/boardSlice";

export const exampleCardId = "example-card-1";

const initialState: Lists = {
  [exampleListId[0]]: {
    id: exampleListId[0],
    title: "To Do",
    cards: [exampleCardId],
  },
  [exampleListId[1]]: {
    id: exampleListId[1],
    title: "Doing",
    cards: [],
  },
  [exampleListId[2]]: {
    id: exampleListId[2],
    title: "Done",
    cards: [],
  },
};

export const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    addList: (
      state,
      action: PayloadAction<{ listId: string; listTitle: string }>
    ) => {
      const listId = action.payload.listId;
      const listTitle = action.payload.listTitle;
      state[listId] = {
        id: listId,
        title: listTitle,
        cards: [],
      };
    },
    removeList: (state, action: PayloadAction<{ listId: string }>) => {
      const listId = action.payload.listId;
      delete state[listId];
    },
    addCardToList: (
      state,
      action: PayloadAction<{ listId: string; cardId: string }>
    ) => {
      const { listId, cardId } = action.payload;

      if (state[listId]) {
        state[listId].cards.push(cardId);
      } else {
        console.error(
          `List with id ${listId} does not exist in state:`,
          Object.keys(state)
        );
      }
    },
    removeCardFromList: (
      state,
      action: PayloadAction<{ listId: string; cardId: string }>
    ) => {
      const { listId, cardId } = action.payload;
      const index = state[listId].cards.findIndex((l) => l === cardId);
      state[listId].cards.splice(index, 1);
    },
    moveCardIds: (
      state,
      action: PayloadAction<{
        fromListId: string;
        toListId: string;
        from: number;
        to: number;
      }>
    ) => {
      const { fromListId, toListId, from, to } = action.payload;
      const moveCardId = state[fromListId].cards.splice(from, 1)[0];
      state[toListId].cards.splice(to, 0, moveCardId);
    },
  },
});

export const {
  addList,
  removeList,
  addCardToList,
  removeCardFromList,
  moveCardIds,
} = listSlice.actions;
export default listSlice.reducer;
