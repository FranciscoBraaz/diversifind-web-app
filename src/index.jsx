import React from "react"
import ReactDOM from "react-dom/client"
import { configureStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import App from "./App.jsx"

// Reducers
import reducer from "./reducers/reducer"
import { SocketContextProvider } from "./context/SocketContext.js"

const queryClient = new QueryClient()

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ immutableCheck: false, serializableCheck: false }),
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SocketContextProvider>
          <App />
        </SocketContextProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
)
