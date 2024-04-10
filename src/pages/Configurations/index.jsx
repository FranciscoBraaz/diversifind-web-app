import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

// Schemas
import { codeFields, emailFields, passwordFields } from "./formFields"

// Services
import { deleteAccount } from "../../services/authServices"

// Utils
import { parseLocalStorageJson } from "../../utils"

// Components
import Button from "../../components/Button"
import Menu from "../../components/Menu"
import ModalEmailForm from "./components/ModalEmailForm"
import ModalPasswordForm from "./components/ModalPasswordForm"
import ConfirmationModal from "../../components/ConfirmationModal"

// Styles
import "./index.scss"

function Configurations() {
  const [showModal, setShowModal] = useState("")
  const [isRemovingAccount, setIsRemovingAccount] = useState(false)
  const user = parseLocalStorageJson("diversiFindUser")
  const navigate = useNavigate()

  async function handleRemoveAccount() {
    try {
      setIsRemovingAccount(true)
      await deleteAccount()
      localStorage.removeItem("diversiFindUser")
      navigate("/login", { replace: true })
      setIsRemovingAccount(false)
      toast("Sua conta foi removida 👋")
    } catch (error) {
      console.error(error)
      setIsRemovingAccount(false)
      toast.error("Erro ao excluir conta")
    }
  }

  return (
    <div className="configurations">
      <div className="configurations__container">
        <Menu />
        <section>
          <h1>Configurações</h1>
          <div className="configurations__container-form">
            <div className="configurations__input-container">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={user?.email ?? ""}
                disabled
              />
            </div>
            <div className="configurations__input-container">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                value="***************"
                disabled
              />
            </div>
            <div className="configurations__container-buttons">
              <Button
                styleType="outlined"
                style={{ width: "fit-content" }}
                onClick={() => setShowModal("change-email")}
              >
                Alterar e-mail
              </Button>
              <Button
                styleType="contained"
                style={{ width: "fit-content" }}
                onClick={() => setShowModal("change-password")}
              >
                Alterar senha
              </Button>
              <Button
                styleType="outlined"
                style={{
                  width: "fit-content",
                  color: "#e73e39",
                  borderColor: "#e73e39",
                  marginLeft: "auto",
                }}
                onClick={() => setShowModal("delete")}
              >
                Excluir conta
              </Button>
            </div>
          </div>
        </section>
      </div>
      <ModalEmailForm
        title="Alterar e-mail"
        emailFields={emailFields}
        codeFields={codeFields}
        open={showModal === "change-email"}
        onClose={() => setShowModal("")}
        maxHeight="60vh"
      />
      <ModalPasswordForm
        title="Alterar senha"
        passwordFields={passwordFields}
        open={showModal === "change-password"}
        onClose={() => setShowModal("")}
        maxHeight="60vh"
      />
      <ConfirmationModal
        open={showModal === "delete"}
        type="delete"
        options={{
          title: "Excluir conta",
          descriptionText:
            "Tem certeza que deseja excluir sua conta? Essa ação é irreversível e todos os seus dados serão apagados.",
          confirmText: "Excluir",
        }}
        actionIsLoading={isRemovingAccount}
        onCloseModal={() => setShowModal("")}
        onConfirm={handleRemoveAccount}
      />
    </div>
  )
}

export default Configurations
