import { useState } from "react"
import { useForm } from "react-hook-form"
import { Oval } from "react-loader-spinner"

// Services
import { forgotPassword } from "../../services/authServices"

// Components
import Button from "../../components/Button"
import UncontrolledInput from "../../components/UncontrolledInput"
import UnauthHeader from "../../components/UnauthHeader"
import UnauthContainer from "../../components/UnauthContainer"

// Assets
import ForgotSvg from "../../assets/forgot-password-illustration.svg?react"

// Styles
import "./index.scss"
import ResendCodeTimer from "../../components/ResendCodeTimer"

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "onBlur",
  })
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [timeToResend, setTimeToResend] = useState(null)

  async function submitForm(values) {
    if (timeToResend) return

    setErrorMessage("")
    setSuccessMessage("")
    try {
      const data = await forgotPassword(values)
      setSuccessMessage(data.message)
    } catch (error) {
      // console.log(error)
      if (error.response.status === 400) {
        setTimeToResend(new Date(error.response.data.timeToResend))
      } else {
        setErrorMessage(error.response.data.message)
      }
    }
  }

  function resetTimetoResend() {
    setTimeToResend(null)
  }

  return (
    <div className="forgot-password">
      <UnauthContainer
        bannerTitle="Esqueceu sua senha?"
        bannerDesc="Vamos te ajudar a recupera-lá"
        renderIllustration={() => <ForgotSvg />}
      >
        <UnauthHeader
          title="Esqueceu senha"
          description="Preencha as informações"
          hasBackButton
          prevRoute="/login"
        />
        <form onSubmit={handleSubmit(submitForm)}>
          <UncontrolledInput
            formField={{
              type: "text",
              name: "email",
              placeholder: "john.doe@example.com",
              label: "E-mail",
              required: true,
            }}
            register={register}
            errors={errors}
          />
          {errorMessage && (
            <p className="forgot-password__message form__error-message">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="forgot-password__message form__success-message">
              {successMessage}
            </p>
          )}
          {timeToResend && (
            <div className="forgot-password__message-container">
              <p>
                Você enviou um e-mail recentemente, aguarde para reenviar outro
                e-mail
              </p>
              <ResendCodeTimer
                time={timeToResend}
                actionWhenFinish={resetTimetoResend}
              />
            </div>
          )}
          <Button
            type="submit"
            styleType="contained"
            disabled={!isValid || timeToResend}
          >
            {isSubmitting ? (
              <Oval
                visible={true}
                height="20"
                width="20"
                color="#fff"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            ) : (
              "Enviar"
            )}
          </Button>
        </form>
      </UnauthContainer>
    </div>
  )
}

export default ForgotPassword
