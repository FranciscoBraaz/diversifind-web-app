import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Oval } from "react-loader-spinner"

// Services
import { resetPassword } from "../../services/authServices"

// Components
import Button from "../../components/Button"
import UncontrolledInput from "../../components/UncontrolledInput"
import UnauthHeader from "../../components/UnauthHeader"
import UnauthContainer from "../../components/UnauthContainer"

// Assets
import ResetSvg from "../../assets/reset-password-illustration.svg?react"

// Styles
import "./index.scss"

function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
  })
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get("token")

  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  async function submitForm(values) {
    setErrorMessage("")
    setSuccessMessage("")
    try {
      const data = await resetPassword({ password: values.password, token })
      setSuccessMessage(data.message)
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (error) {
      // console.log(error)
      setErrorMessage(error.response.data.message)
    }
  }

  return (
    <div className="reset-password">
      <UnauthContainer
        bannerTitle="Quase lá"
        bannerDesc="Falta pouco para recuperar seu acesso"
        renderIllustration={() => <ResetSvg />}
      >
        <UnauthHeader
          title="Alterar senha"
          description="Preencha as informações"
        />
        <form onSubmit={handleSubmit(submitForm)}>
          <UncontrolledInput
            formField={{
              type: "password",
              name: "password",
              placeholder: "******",
              label: "Nova senha",
              required: true,
            }}
            register={register}
            errors={errors}
          />
          <UncontrolledInput
            formField={{
              type: "password",
              name: "confirm-password",
              placeholder: "******",
              label: "Confirmar nova senha",
              required: true,
            }}
            register={register}
            errors={errors}
          />
          {errorMessage && (
            <p className="reset-password__message form__error-message">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <div className="reset-password__success-message__container">
              <p className="reset-password__message form__success-message">
                {successMessage}
              </p>
              <Oval
                visible={true}
                height="20"
                width="20"
                color="#1dc690"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          )}
          <Button type="submit" styleType="contained">
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
              "Alterar"
            )}
          </Button>
        </form>
      </UnauthContainer>
    </div>
  )
}

export default ResetPassword
