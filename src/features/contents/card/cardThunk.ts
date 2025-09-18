import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "../../../App/store";
import { deleteDoc, doc, setDoc, writeBatch } from "firebase/firestore";
import { db } from "../../../firebase";
import { optimisticAddCard, optimisticRemoveCard } from "./cardSlice";
import {
  addCardToList,
  moveCardIds,
  removeCardFromList,
} from "../list/listSlice";

interface AddCardArgs {
  cardId: string;
  cardTitle: string;
  listId: string;
  order: number;
}

const addCard = createAsyncThunk<
  void,
  AddCardArgs,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  "card/addCard",
  async (
    { cardId, cardTitle, listId, order },
    { dispatch, rejectWithValue }
  ) => {
    const tempCard = {
      id: cardId,
      title: cardTitle,
      listId,
      order,
    };

    dispatch(optimisticAddCard(tempCard));
    dispatch(addCardToList({ listId, cardId }));

    try {
      await setDoc(doc(db, "cards", cardId), tempCard);
      return;
    } catch (e) {
      dispatch(optimisticRemoveCard({ cardId }));
      alert("カードの追加に失敗しました。ネットワークを確認してください。");
      return rejectWithValue((e as Error).message);
    }
  }
);

interface RemoveCardArgs {
  cardId: string;
  listId: string;
}

const removeCard = createAsyncThunk<
  void,
  RemoveCardArgs,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  "card/removeCard",
  async ({ cardId, listId }, { getState, dispatch, rejectWithValue }) => {
    const prevCard = getState().card.cards[cardId];

    dispatch(optimisticRemoveCard({ cardId }));
    dispatch(removeCardFromList({ cardId, listId }));

    try {
      await deleteDoc(doc(db, "cards", cardId));
      return;
    } catch (e) {
      if (prevCard) {
        dispatch(optimisticAddCard(prevCard));
        dispatch(addCardToList({ cardId, listId }));
      }
      alert("カードの削除に失敗しました");
      return rejectWithValue((e as Error).message);
    }
  }
);

interface MoveCardArgs {
  fromListId: string;
  toListId: string;
  from: number;
  to: number;
}

const moveCard = createAsyncThunk<
  void,
  MoveCardArgs,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  "card/moveCard",
  async (
    { fromListId, toListId, from, to },
    { getState, dispatch, rejectWithValue }
  ) => {
    dispatch(moveCardIds({ fromListId, toListId, from, to }));

    try {
      const newOrder = getState().list.lists[toListId].cards;

      const batch = writeBatch(db);
      newOrder.forEach((cardId, index) => {
        const ref = doc(db, "cards", cardId);
        batch.update(ref, { listId: toListId, order: index });
      });

      await batch.commit();

      return;
    } catch (e) {
      dispatch(
        moveCardIds({
          fromListId: toListId,
          toListId: fromListId,
          from: to,
          to: from,
        })
      );
      alert("カードの移動に失敗しました");
      return rejectWithValue((e as Error).message);
    }
  }
);

export { addCard, removeCard, moveCard };
