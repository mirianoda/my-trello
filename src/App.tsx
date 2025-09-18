import Board from "./features/contents/board/Board";
import Header from "./features/header/Header";
import Sidebar from "./features/sidebar/Sidebar";
import style from "./App.module.scss";
import { useEffect } from "react";
import Login from "./features/login/Login";
import { useAppDispatch, useAppSelector } from "./App/hooks";
import { auth, db } from "./firebase";
import { login, logout } from "./App/slices/userSlice";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import type { Boards, Cards, Lists } from "./features/contents/types";
import { setBoards } from "./features/contents/board/boardSlice";
import { setLists } from "./features/contents/list/listSlice";
import { setCards } from "./features/contents/card/cardSlice";
import { nanoid } from "nanoid";
import { Toaster } from "react-hot-toast";

function App() {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (loginUser) => {
      if (loginUser) {
        const uid = loginUser.uid;
        const q = query(collection(db, "boards"), where("ownerId", "==", uid));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          //初期ボード・リスト・カードを作成
          const boardId = nanoid();
          await setDoc(doc(db, "boards", boardId), {
            id: boardId,
            title: "My Board",
            ownerId: uid,
            members: [uid],
            createdAt: serverTimestamp(),
          });

          const lists = [
            { title: "To Do", id: nanoid() },
            { title: "Doing", id: nanoid() },
            { title: "Done", id: nanoid() },
          ];
          await Promise.all(
            lists.map((list, index) =>
              setDoc(doc(db, "lists", list.id), {
                id: list.id,
                title: list.title,
                boardId,
                order: index,
              })
            )
          );

          const cardId = nanoid();
          await setDoc(doc(db, "cards", cardId), {
            id: cardId,
            title: "Let's enjoy TaskFlow!",
            listId: lists[0].id,
            order: 0,
          });
        }

        const userData = {
          uid: loginUser.uid,
          photo: loginUser.photoURL,
          email: loginUser.email,
          displayName: loginUser.displayName,
        };

        dispatch(login(userData));
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;

    let latestBoards: Boards = {};
    let latestLists: Lists = {};
    let latestCards: Cards = {};

    const syncAllData = () => {
      const updatedBoards: Boards = {};
      Object.entries(latestBoards).forEach(([boardId, board]) => {
        const boardLists = Object.values(latestLists)
          .filter((list) => list.boardId === boardId)
          .sort((a, b) => a.order - b.order)
          .map((list) => list.id);

        updatedBoards[boardId] = {
          ...board,
          lists: boardLists,
        };
      });

      const updatedLists: Lists = {};
      Object.entries(latestLists).forEach(([listId, list]) => {
        const listCards = Object.values(latestCards)
          .filter((card) => card.listId === listId)
          .sort((a, b) => a.order - b.order)
          .map((card) => card.id);

        updatedLists[listId] = {
          ...list,
          cards: listCards,
        };
      });

      dispatch(setBoards(updatedBoards));
      dispatch(setLists(updatedLists));
      dispatch(setCards(latestCards));
    };

    const boardsCol = collection(db, "boards");
    const unsubscribeBoards = onSnapshot(boardsCol, (snap) => {
      console.log("📋 ボード更新");
      latestBoards = {};
      snap.docs.forEach((d) => {
        const data = d.data();
        latestBoards[d.id] = {
          id: data.id,
          title: data.title,
          ownerId: data.ownerId,
          members: data.members,
          createdAt: data.createdAt.toDate().toISOString(),
          lists: [],
        };
      });
      syncAllData();
    });

    const listsCol = collection(db, "lists");
    const unsubscribeLists = onSnapshot(listsCol, (snap) => {
      console.log("📝 リスト更新");
      latestLists = {};
      snap.docs.forEach((d) => {
        const data = d.data();
        latestLists[d.id] = {
          id: data.id,
          title: data.title,
          boardId: data.boardId,
          order: data.order,
          cards: [],
        };
      });
      syncAllData();
    });

    const cardsCol = collection(db, "cards");
    const unsubscribeCards = onSnapshot(cardsCol, (snap) => {
      console.log("🃏 カード更新");
      latestCards = {};
      snap.docs.forEach((d) => {
        const data = d.data();
        latestCards[d.id] = {
          id: data.id,
          title: data.title,
          listId: data.listId,
          order: data.order,
        };
      });
      syncAllData();
    });

    return () => {
      unsubscribeBoards();
      unsubscribeLists();
      unsubscribeCards();
    };
  }, [user, dispatch]);

  return (
    <>
      {user ? (
        <div className={style.layout}>
          {/* ヘッダー */}
          <Header />

          <div className={style.main}>
            {/* サイドバー */}
            <Sidebar />

            {/* ボード */}
            <Board />
          </div>
        </div>
      ) : (
        <Login />
      )}
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default App;
