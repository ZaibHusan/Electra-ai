import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import conversationsReducer from "./conversationsSlice";
import promptReducer from "./promptSlice"; // Make sure this file exists!
import knowledgeReducer from "./knowledgeSlice";
import systemSlice from './systemSlice.js'

export const Store = configureStore({
    reducer: {
        auth: authReducer,
        conversations: conversationsReducer,
        prompt: promptReducer,
        knowledge: knowledgeReducer,
        system: systemSlice
    },
});