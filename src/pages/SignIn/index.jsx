import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Oval } from "react-loader-spinner"

// Services
import { apiPrivate } from "../../services/api"
import { resendConfirmationEmail, signIn } from "../../services/authServices"

// Components
import UncontrolledInput from "../../components/UncontrolledInput"
import Button from "../../components/Button"
import TextLink from "../../components/TextLink"
import UnauthHeader from "../../components/UnauthHeader"
import UnauthContainer from "../../components/UnauthContainer"
import ResendCodeTimer from "../../components/ResendCodeTimer"

// Assets
import LoginSvg from "../../assets/login.svg?react"
// import LinkedinIcon from "../../assets/linkedin-icon.svg?react"

// Styles
import "./index.scss"

function SignIn() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [errorMessage, setErrorMessage] = useState("")
  const [timeToExpire, setTimeToExpire] = useState(null)
  const [loadingResendEmail, setLoadingResendEmail] = useState(false)
  const [resendEmailMessage, setResendEmailMessage] = useState("")

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onBlur",
  })

  useEffect(() => {
    if (resendEmailMessage) {
      setTimeout(() => {
        setResendEmailMessage("")
      }, 5000)
    }
  }, [resendEmailMessage])

  async function submitForm(values) {
    try {
      const data = await signIn(values)
      const userInfo = {
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        headline: data.headline,
        followers: data.followers,
        following: data.following,
        resumeUrl: data.resumeUrl,
        _id: data._id,
      }

      apiPrivate.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.accessToken}`
      localStorage.setItem("diversiFindUser", JSON.stringify(userInfo))
      dispatch({ type: "CHANGE_USER", payload: userInfo })

      navigate("/")
    } catch (error) {
      // console.log(error)
      if (error.response.status === 401) {
        setErrorMessage(error.response.data.message)
        return
      }

      if (error.response.status === 403) {
        setTimeToExpire(new Date(error.response.data.expiresTime * 1000))
        return
      }

      setErrorMessage("Erro interno do servidor")
      // console.log(error)
    }
  }

  async function resendEmail() {
    setLoadingResendEmail(true)
    try {
      const { data } = await resendConfirmationEmail({
        email: getValues().email,
      })
      setResendEmailMessage(data.message)
      setTimeToExpire(null)
    } catch (error) {
      // console.log(error)
      setErrorMessage("Houve um erro ao enviar o e-mail")
    } finally {
      setLoadingResendEmail(false)
    }
  }

  return (
    <div className="sign-in">
      <UnauthContainer
        bannerTitle="Bem vindo(a) ao DiversiFind"
        bannerDesc="Uma plataforma acessível para o mercado de trabalho"
        renderIllustration={() => <LoginSvg />}
      >
        <UnauthHeader title="Login" description="Preencha as informações" />
        <form onSubmit={handleSubmit(submitForm)}>
          <UncontrolledInput
            formField={{
              type: "email",
              name: "email",
              placeholder: "john.doe@example.com",
              label: "E-mail",
              regex: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              regexErrorMessage: "Formato de e-mail inválido",
              required: true,
            }}
            register={register}
            errors={errors}
          />
          <UncontrolledInput
            formField={{
              type: "password",
              name: "password",
              placeholder: "******",
              label: "Senha",
              required: true,
            }}
            register={register}
            errors={errors}
          />
          <TextLink link="/esqueceu-senha" style={{ alignSelf: "flex-end" }}>
            Esqueceu a senha?
          </TextLink>

          {!timeToExpire && errorMessage && (
            <p className="form__error-message">{errorMessage}</p>
          )}
          {timeToExpire && (
            <div className="sign-in__resend-code">
              <p>
                Este usuário ainda não está ativo. Cheque seu e-mail para ativar
                sua conta.
              </p>
              <ResendCodeTimer
                text="Reenviar e-mail"
                time={timeToExpire}
                loadingResend={loadingResendEmail}
                onResend={resendEmail}
              />
            </div>
          )}
          {resendEmailMessage && (
            <p className="form__success-message">{resendEmailMessage}</p>
          )}

          <Button
            type="submit"
            styleType="contained"
            disabled={!isValid || isSubmitting}
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
              "Entrar"
            )}
          </Button>
          <div className="sign-in__create-account">
            <span>Não tem uma conta? </span>
            <TextLink link="/cadastro" style={{ alignSelf: "center" }}>
              Cadastre-se
            </TextLink>
          </div>
        </form>
      </UnauthContainer>
    </div>
  )
}

export default SignIn
