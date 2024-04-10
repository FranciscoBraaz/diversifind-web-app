import { createContext, useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { io } from "socket.io-client"

// Constants
import { BASE_URL } from "../services/api"

const SocketContext = createContext()

export function SocketContextProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const { user } = useSelector((state) => state.app)
  const userId = user?._id

  useEffect(() => {
    function initializeSocket(userId) {
      if (userId && !socket) {
        const socket = io(BASE_URL, {
          reconnectionAttempts: 1,
          query: {
            userId: userId,
          },
        })
        setSocket(socket)

        socket.on("onlineUsers", (users) => {
          setOnlineUsers(users)
        })
      }
    }

    function closeSocket() {
      if (socket) {
        socket?.close()
        setSocket(null)
      }
    }

    if (userId) {
      initializeSocket(userId)
    } else {
      closeSocket()
    }

    return () => {
      closeSocket()
    }
  }, [userId, socket])

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = () => {
  return useContext(SocketContext)
}
