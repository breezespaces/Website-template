"use client"

import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage" // uses localStorage
import cartReducer from "./cartSlice"

// Custom storage with fallback
const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
})

const storageWithFallback = (() => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return storage
    }
  } catch (error) {
    console.warn('localStorage not available, falling back to noop storage')
  }
  return createNoopStorage()
})()

const rootReducer = combineReducers({
  cart: cartReducer,
})

const persistConfig = {
  key: "root",
  storage: storageWithFallback,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// ✅ Don't create persistor here
export const makeStore = () =>
  configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
