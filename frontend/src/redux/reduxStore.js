import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import conversationsSlice from "./conversationsSlice";
// import { conversationsReducer } from "./conversationsSlice";
// import messagesReducer from "./messagesSlice";
// import promptsReducer from "./promptsSlice";
// import knowledgeReducer from "./knowledgeReducer";
// import dashboardReducer from "./dashboardSlice";
// import uiReducer from "./uiSlice";

export const Store = configureStore({
    reducer: {
        auth: authReducer,
        conversations: conversationsSlice,
        // messages: messagesReducer,
        // prompts: promptsReducer,
        // knowledge: knowledgeReducer,
        // dashboard: dashboardReducer,
        // ui: uiReducer,
    },
});