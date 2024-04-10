import { Navigate, Outlet } from "react-router-dom"
import Header from "../Header"
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import "./index.scss"

export default function RoutesLayout({ isPublic = false, isNotFound = false }) {
  const loggedUserStringified = localStorage.getItem("diversiFindUser")
  if (isPublic) {
    if (loggedUserStringified || isNotFound) return <Navigate to="/" />
    return <Outlet />
  }

  if (!loggedUserStringified || isNotFound) return <Navigate to="/login" />

  if (isNotFound) return <Navigate to="/" />

  return (
    <>
      <Header />
      <main className="main">
        <Outlet />
      </main>
      {/* <ReactQueryDevtools /> */}
    </>
  )
}
