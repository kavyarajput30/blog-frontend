import { configureStore ,combineReducers} from "@reduxjs/toolkit";
import userreducer from "../features/user/userSlice.js";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import themeReducer from "../features/theme/themeSlice.js"
const rootReducer = combineReducers({
  user: userreducer,
  theme:themeReducer,
});

const persistconfig ={
  key:"root",
  storage,
  version:1,
}


const persistedReducer = persistReducer(persistconfig, rootReducer);
export const store = configureStore({
  reducer:persistedReducer,
  middleware: (getDefaultMiddleware) =>getDefaultMiddleware({
    serializableCheck: false
  })
});


export const persistor = persistStore(store)