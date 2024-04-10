import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useQueryClient } from "@tanstack/react-query"
import { ToastContainer } from "react-toastify"

// Contexts
import { useSocketContext } from "./context/SocketContext"

// Components
import RoutesLayout from "./components/RoutesLayout"

// Public pages
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import ResetPassword from "./pages/ResetPassword"
import ConfirmEmail from "./pages/ConfirmAccount"
import ForgotPassword from "./pages/ForgotPassword"

// Private pages
import Home from "./pages/Home"
import PostInfo from "./pages/PostInfo"
import Profile from "./pages/Profile"
import Jobs from "./pages/Jobs"
import RegisterJob from "./pages/RegisterJob"
import MyJobs from "./pages/MyJobs"
import Vacancy from "./pages/Vacancy"
import Communities from "./pages/Communities"
import MyCommunities from "./pages/MyCommunities"
import ChatMessage from "./pages/ChatMessage"
import MyNetwork from "./pages/MyNetwork"
import MyApplications from "./pages/MyApplications"
import Configurations from "./pages/Configurations"
import NotFound from "./pages/NotFound"

// Styles
import "./styles/index.scss"
import "react-toastify/dist/ReactToastify.css"
import Help from "./pages/Help"

function App() {
  const { socket } = useSocketContext()
  const queryClient = useQueryClient()

  const dispatch = useDispatch()

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("diversiFindUser"))
    if (loggedUser) {
      dispatch({
        type: "CHANGE_USER",
        payload: loggedUser,
      })
    }
  }, [dispatch])

  useEffect(() => {
    socket?.on("newMessage", async (newMessage) => {
      queryClient.setQueryData(
        ["conversation-messages", newMessage.conversationId],
        (oldData) => {
          if (oldData && oldData.pages.length > 0) {
            let newFirstPage = [newMessage, ...oldData.pages[0].messages]
            let newData = [
              {
                messages: newFirstPage,
                totalPages: oldData.pages[0].totalPages,
              },
              ...oldData.pages.slice(1),
            ]

            return { pages: newData, pageParams: oldData.pageParams }
          }

          let newFirstPage = [{ messages: [newMessage], totalPages: 1 }]

          return { pages: newFirstPage, pageParams: [undefined] }
        },
      )

      await queryClient.invalidateQueries({
        queryKey: ["conversations"],
      })
    })

    return () => {
      socket?.off("newMessage")
    }
  }, [socket, queryClient])

  return (
    <Router>
      {/* <div className="row">
        // <div className="column"> */}
      <ToastContainer theme="colored" draggable={false} />
      <Routes>
        <Route path="/login" element={<RoutesLayout isPublic />}>
          <Route path="" element={<SignIn />} />
        </Route>
        <Route path="/cadastro" element={<RoutesLayout isPublic />}>
          <Route path="" element={<SignUp />} />
        </Route>
        <Route path="/esqueceu-senha" element={<RoutesLayout isPublic />}>
          <Route path="" element={<ForgotPassword />} />
        </Route>
        <Route path="/alterar-senha" element={<ResetPassword />} />
        <Route path="/verificar-email" element={<ConfirmEmail />} />
        <Route path="/" element={<RoutesLayout />}>
          <Route path="" element={<Home />} />
        </Route>
        <Route path="/publicacao/:id" element={<RoutesLayout />}>
          <Route path="" element={<PostInfo />} />
        </Route>
        <Route path="/perfil/:id" element={<RoutesLayout />}>
          <Route path="" element={<Profile />} />
        </Route>
        <Route path="/vagas" element={<RoutesLayout />}>
          <Route path="todas-vagas/:page?/:keyword?" element={<Jobs />} />
          <Route path="criar-vaga" element={<RegisterJob />} />
          <Route path="editar-vaga/:vacancyId" element={<RegisterJob />} />
          <Route path="minhas-vagas/:page?/:keyword?" element={<MyJobs />} />
          <Route
            path="minhas-aplicacoes/:page?/:keyword?"
            element={<MyApplications />}
          />
          <Route path="vaga/:id" element={<Vacancy />} />
        </Route>
        <Route path="/comunidades" element={<RoutesLayout />}>
          <Route
            path="todas-comunidades/:page?/:keyword?"
            element={<Communities />}
          />
          <Route
            path="minhas-comunidades/:page?/:keyword?"
            element={<MyCommunities />}
          />
        </Route>
        <Route path="/mensagens" element={<RoutesLayout />}>
          <Route path="" element={<ChatMessage />} />
        </Route>
        <Route path="/conexoes" element={<RoutesLayout />}>
          <Route path=":page?/:keyword?" element={<MyNetwork />} />
        </Route>
        <Route path="/configuracoes" element={<RoutesLayout />}>
          <Route path="" element={<Configurations />} />
        </Route>
        <Route path="/ajuda" element={<Help />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* </div>
      </div> */}
    </Router>
  )
}

export default App
