import { createSlice } from "@reduxjs/toolkit";
import type { Lists } from "../types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { addList } from "./listThunks";

export const exampleCardId = "example-card-1";

interface List {
  id: string;
  title: string;
  boardId: string;
  order: number;
}
interface ListsState {
  lists: Lists;
  isLoading: boolean;
}

const initialState: ListsState = { lists: {}, isLoading: true };

export const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    optimisticAddList: (state, action: PayloadAction<List>) => {
      const newList = action.payload;
      state.lists[newList.id] = { ...newList, cards: [] };
    },
    optimisticRemoveList: (
      state,
      action: PayloadAction<{ listId: string }>
    ) => {
      delete state.lists[action.payload.listId];
    },
    setLists: (state, action: PayloadAction<Lists>) => {
      state.lists = action.payload;
      state.isLoading = false;
    },
    addCardToList: (
      state,
      action: PayloadAction<{ listId: string; cardId: string }>
    ) => {
      const { listId, cardId } = action.payload;

      if (state.lists[listId]) {
        state.lists[listId].cards.push(cardId);
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
      const index = state.lists[listId].cards.findIndex((l) => l === cardId);
      state.lists[listId].cards.splice(index, 1);
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
      const moveCardId = state.lists[fromListId].cards.splice(from, 1)[0];
      state.lists[toListId].cards.splice(to, 0, moveCardId);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addList.rejected, (state, action) => {
      console.error(action.payload);
      state.isLoading = false;
    });
  },
});

export const {
  optimisticAddList,
  optimisticRemoveList,
  setLists,
  addCardToList,
  removeCardFromList,
  moveCardIds,
} = listSlice.actions;
export default listSlice.reducer;
