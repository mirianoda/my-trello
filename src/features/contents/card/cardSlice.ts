import { createSlice } from "@reduxjs/toolkit";
import type { Cards } from "../types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { addCard } from "./cardThunk";

interface Card {
  id: string;
  title: string;
  listId: string;
  order: number;
}
interface CardsState {
  cards: Cards;
  isLoading: boolean;
}

const initialState: CardsState = { cards: {}, isLoading: true };

export const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    optimisticAddCard: (state, action: PayloadAction<Card>) => {
      const newCard = action.payload;
      state.cards[newCard.id] = newCard;
    },
    optimisticRemoveCard: (
      state,
      action: PayloadAction<{ cardId: string }>
    ) => {
      delete state.cards[action.payload.cardId];
    },
    setCards: (state, action: PayloadAction<Cards>) => {
      state.cards = action.payload;
      state.isLoading = false;
    },
    resetCards: (state) => {
      state.cards = {};
      state.isLoading = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addCard.rejected, (state, action) => {
      console.error(action.payload);
      state.isLoading = false;
    });
  },
});

export const { optimisticAddCard, optimisticRemoveCard, setCards, resetCards } =
  cardSlice.actions;
export default cardSlice.reducer;
