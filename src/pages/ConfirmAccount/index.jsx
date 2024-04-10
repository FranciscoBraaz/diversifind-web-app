import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { confirmEmail } from "../../services/authServices"

// Assets
import EmailSvg from "../../assets/email.svg?react"

import "./index.scss"

function ConfirmEmail() {
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get("token")

  useEffect(() => {
    const abortController = new AbortController()

    async function onConfirmEmail() {
      try {
        if (!token) {
          setErrorMessage("Não foi possível confirmar o email")
          return
        }

        await confirmEmail({ token, signal: abortController.signal })
        setTimeout(() => {
          navigate("/login")
        }, 2500)
        setSuccessMessage(
          "Email confirmado! Redirecionando para a página de login...",
        )
      } catch (error) {
        // console.log(error)
        if (error.message !== "canceled" && !error?.response) {
          setErrorMessage("Não foi possível confirmar o email")
          return
        }

        setErrorMessage(error.response.data.message)
      } finally {
        setLoading(false)
      }
    }

    onConfirmEmail()

    return () => {
      abortController.abort()
    }
  }, [token, navigate])

  return (
    <div className="confirm-email">
      <h1>DiversiFind</h1>
      {loading && <p>Confirmando e-mail...</p>}
      {errorMessage && <p>❌ {errorMessage}</p>}
      {successMessage && <p>✅ {successMessage}</p>}
      <EmailSvg />
    </div>
  )
}

export default ConfirmEmail
