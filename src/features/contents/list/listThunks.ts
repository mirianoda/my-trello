import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "../../../App/store";
import { optimisticAddList, optimisticRemoveList } from "./listSlice";
import { deleteDoc, doc, setDoc, writeBatch } from "firebase/firestore";
import { db } from "../../../firebase";
import {
  addListToBoard,
  moveListIds,
  removeListFromBoard,
} from "../board/boardSlice";

interface AddListArgs {
  listId: string;
  listTitle: string;
  boardId: string;
  order: number;
}

const addList = createAsyncThunk<
  void,
  AddListArgs,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  "list/addList",
  async (
    { listId, listTitle, boardId, order },
    { dispatch, rejectWithValue }
  ) => {
    const tempList = {
      id: listId,
      title: listTitle,
      boardId,
      order,
    };

    dispatch(optimisticAddList(tempList));
    dispatch(addListToBoard({ listId, boardId }));

    try {
      await setDoc(doc(db, "lists", listId), tempList);
      return;
    } catch (e) {
      dispatch(optimisticRemoveList({ listId }));
      dispatch(removeListFromBoard({ listId, boardId }));
      alert("リストの追加に失敗しました。ネットワークを確認してください。");
      return rejectWithValue((e as Error).message);
    }
  }
);

interface RemoveListArgs {
  listId: string;
  boardId: string;
}

const removeList = createAsyncThunk<
  void,
  RemoveListArgs,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  "list/removeList",
  async ({ listId, boardId }, { getState, dispatch, rejectWithValue }) => {
    const prevList = getState().list.lists[listId];

    dispatch(optimisticRemoveList({ listId }));
    dispatch(removeListFromBoard({ listId, boardId }));

    try {
      await deleteDoc(doc(db, "lists", listId));
      return;
    } catch (e) {
      if (prevList) {
        dispatch(optimisticAddList(prevList));
        dispatch(addListToBoard({ listId, boardId }));
      }
      alert("リストの削除に失敗しました");
      return rejectWithValue((e as Error).message);
    }
  }
);

interface MoveListArgs {
  boardId: string;
  from: number;
  to: number;
}

const moveList = createAsyncThunk<
  void,
  MoveListArgs,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  "list/moveList",
  async ({ boardId, from, to }, { getState, dispatch, rejectWithValue }) => {
    dispatch(moveListIds({ boardId, from, to }));

    try {
      const newOrder = getState().board.boards[boardId].lists;

      const batch = writeBatch(db);
      newOrder.forEach((listId, index) => {
        const ref = doc(db, "lists", listId);
        batch.update(ref, { order: index });
      });

      await batch.commit();

      return;
    } catch (e) {
      dispatch(moveListIds({ boardId, from: to, to: from }));
      alert("リストの移動に失敗しました");
      return rejectWithValue((e as Error).message);
    }
  }
);

export { addList, removeList, moveList };
