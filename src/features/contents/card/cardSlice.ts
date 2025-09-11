import { createSlice } from "@reduxjs/toolkit";
import type { Cards } from "../types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { exampleCardId } from "../list/listSlice";

const initialState: Cards = {
  [exampleCardId]: {
    id: exampleCardId,
    title: "Let's enjoy Trello!",
  },
};

export const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    addCard: (
      state,
      action: PayloadAction<{ cardId: string; cardTitle: string }>
    ) => {
      const cardId = action.payload.cardId;
      const cardTitle = action.payload.cardTitle;
      state[cardId] = {
        id: cardId,
        title: cardTitle,
      };
    },
    removeCard: (state, action: PayloadAction<{ cardId: string }>) => {
      const cardId = action.payload.cardId;
      delete state[cardId];
    },
  },
});

export const { addCard, removeCard } = cardSlice.actions;
export default cardSlice.reducer;
