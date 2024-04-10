import { useState } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { Oval } from "react-loader-spinner"
import { useNavigate } from "react-router-dom"

// Services
import { signUpPerson } from "../../services/authServices"

// Assets
import SignUpSvg from "../../assets/sign-up-illustration.svg?react"

// Custom hooks
import { useRenderFormFields } from "../../hooks/useRenderFormFields"

// Schemas
import { authFields } from "./formFields"

// Components
import UnauthHeader from "../../components/UnauthHeader"
import Button from "../../components/Button"
import UnauthContainer from "../../components/UnauthContainer"

// Styles
import "./index.scss"
import { toast } from "react-toastify"

function AuthInfo() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid },
    getValues,
    setValue,
  } = useFormContext()
  const { renderFormFields } = useRenderFormFields({
    register,
    errors,
    getValues,
    setValue,
  })
  const navigate = useNavigate()

  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  async function submitFormPerson(values) {
    if (errorMessage) setErrorMessage("")
    if (successMessage) setSuccessMessage("")

    try {
      const { data } = await signUpPerson(values)
      setSuccessMessage(data.message)
      toast.success(data.message)
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (error) {
      // console.log(error)
      setErrorMessage(error.response.data.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(submitFormPerson)}>
      <div className="sign-up__container-inputs">
        {authFields.map((field) => renderFormFields(field))}
      </div>
      {errorMessage && (
        <p className="sign-up__message form__error-message">{errorMessage}</p>
      )}
      {successMessage && (
        <div className="sign-up__success-message__container">
          <p className="sign-up__message form__success-message">
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
      <Button type="submit" styleType="contained" disabled={!isValid}>
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
          "Cadastrar-se"
        )}
      </Button>
    </form>
  )
}

function SignUp() {
  const methods = useForm({
    mode: "onBlur",
  })

  return (
    <div className="sign-up">
      <UnauthContainer
        bannerTitle="Quase lá"
        bannerDesc="Faça seu cadastro para usar a plataforma"
        renderIllustration={() => <SignUpSvg />}
      >
        <UnauthHeader
          title="Cadastro"
          description="Preencha as informações"
          hasBackButton
          prevRoute="/login"
        />

        <FormProvider {...methods}>
          <AuthInfo />
        </FormProvider>
      </UnauthContainer>
    </div>
  )
}

export default SignUp
