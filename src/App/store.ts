import { configureStore, combineReducers } from "@reduxjs/toolkit";
import boardReducer from "../features/contents/board/boardSlice";
import listReducer from "../features/contents/list/listSlice";
import cardReducer from "../features/contents/card/cardSlice";
import sessionReducer from "./sessionSlice";
import userReducer from "./userSlice";
import { persistReducer, persistStore } from "redux-persist";
import localForage from "localforage";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const rootReducers = combineReducers({
  board: boardReducer,
  list: listReducer,
  card: cardReducer,
  session: sessionReducer,
  user: userReducer,
});

const persistConfig = {
  key: "root",
  storage: localForage,
};

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
