import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "../../../App/store";
import { logout } from "../../../App/slices/userSlice";
import { optimisticAddBoard, optimisticRemoveBoard } from "./boardSlice";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import toast from "react-hot-toast";

interface AddBoardArgs {
  boardId: string;
  boardTitle: string;
}

const addBoard = createAsyncThunk<
  void,
  AddBoardArgs,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  "board/addBoard",
  async ({ boardId, boardTitle }, { getState, dispatch, rejectWithValue }) => {
    const uid = getState().user.user?.uid;

    if (!uid) {
      toast.error("ユーザー認証に失敗しました。再度ログインしてください。");
      dispatch(logout());
      return rejectWithValue("ユーザーがログインしていません");
    }

    const tempBoard = {
      id: boardId,
      title: boardTitle,
      ownerId: uid,
      members: [uid],
      createdAt: new Date().toISOString(),
    };

    dispatch(optimisticAddBoard(tempBoard));

    try {
      await setDoc(doc(db, "boards", boardId), {
        ...tempBoard,
        createdAt: serverTimestamp(),
      });
      return;
    } catch (e) {
      dispatch(removeBoard({ boardId }));
      toast.error(
        "ボードの追加に失敗しました。ネットワークを確認してください。"
      );
      return rejectWithValue((e as Error).message);
    }
  }
);

interface RemoveBoardArgs {
  boardId: string;
}

const removeBoard = createAsyncThunk<
  void,
  RemoveBoardArgs,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  "board/removeBoard",
  async ({ boardId }, { getState, dispatch, rejectWithValue }) => {
    const prevBoard = getState().board.boards[boardId];

    dispatch(optimisticRemoveBoard({ boardId }));

    try {
      await deleteDoc(doc(db, "boards", boardId));
      return;
    } catch (e) {
      if (prevBoard) {
        dispatch(optimisticAddBoard(prevBoard));
      }
      toast.error("ボードの削除に失敗しました");
      return rejectWithValue((e as Error).message);
    }
  }
);

export { addBoard, removeBoard };
