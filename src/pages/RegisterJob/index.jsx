import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { ArrowLeftCircle, Lightbulb } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import Skeleton from "react-loading-skeleton"
import _ from "lodash"

// Services
import {
  createVacancy,
  editVacancy,
  getVacancy,
} from "../../services/vacancyService"

// Components
import Menu from "../../components/Menu"
import StepProgress from "../../components/StepProgress"
import InitialInfo from "./components/InitialInfo"
import JobDescription from "./components/JobDescription"
import AccessibilityInfo from "./components/AccessibilityInfo"
import Chip from "../../components/Chip"

// Styles
import "./index.scss"
import "react-loading-skeleton/dist/skeleton.css"

function SkeletonBody() {
  return (
    <div className="register-job__skeleton-body">
      <header>
        <div>
          <Skeleton style={{ height: 35, width: 200 }} />
        </div>
        <div>
          <Skeleton style={{ height: 20, width: 100 }} />
        </div>
      </header>
      <div className="register-job__skeleton-body__step">
        <div>
          <div>
            <Skeleton style={{ height: 50, width: 50, borderRadius: "50%" }} />
          </div>
          <div>
            <Skeleton style={{ height: 5, width: 40 }} />
          </div>
          <div>
            <Skeleton style={{ height: 50, width: 50, borderRadius: "50%" }} />
          </div>
          <div>
            <Skeleton style={{ height: 5, width: 40 }} />
          </div>
          <div>
            <Skeleton style={{ height: 50, width: 50, borderRadius: "50%" }} />
          </div>
        </div>
      </div>
      <Skeleton style={{ height: 35, marginTop: 32, width: "70%" }} />
      <Skeleton style={{ height: 35, marginTop: 16, width: "80%" }} />
      <Skeleton style={{ height: 35, marginTop: 16, width: "70%" }} />
      <Skeleton style={{ height: 35, marginTop: 16, width: "60%" }} />
      <Skeleton style={{ height: 35, marginTop: 16, width: "80%" }} />
      <Skeleton style={{ height: 35, marginTop: 16, width: "100%" }} />
    </div>
  )
}

function RegisterJob() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmiting, setIsSubmiting] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const { vacancyId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const methods = useForm({ mode: "onSubmit" })
  const { reset } = methods

  const { isLoading, data, status } = useQuery({
    queryKey: ["edit-vacancy", vacancyId],
    queryFn: () => fetchVacancy(),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    keepPreviousData: true,
    enabled: !!vacancyId,
    retry: false,
  })

  useEffect(() => {
    async function defineFormInfo() {
      if (!vacancyId) {
        setCurrentStep(1)
        await reset({
          occupation: "",
          company: "",
          description: "",
          typeLocation: "",
          stateUf: "",
          city: "",
          contractType: "",
          employmentType: "",
          occupationArea: "",
          skills: [],
          selectiveProcessAccessibility: {},
          jobAccessibility: {},
          accommodationAccessibility: {},
        })
        setTimeout(() => {
          setInitialLoading(false)
        }, 500)
        return
      }

      if (status === "success" && !_.isEmpty(data)) {
        let formData = {}
        formData["occupation"] = data.occupation
        formData["company"] = data.company
        formData["description"] = data.description
        formData["typeLocation"] = data.typeLocation
        formData["stateUf"] = data.stateUf
        formData["city"] = data.city
        formData["contractType"] = data.contractType
        formData["employmentType"] = data.employmentType
        formData["occupationArea"] = data.occupationArea._id
        formData["skills"] = data.skills.map((skill) => skill._id)

        /* convert selectiveProcessAccessibility array into a object */
        let selectiveProcessAccessibility = {}
        data.selectiveProcessAccessibility.forEach((key) => {
          selectiveProcessAccessibility[key] = true
        })

        /* convert jobAccessibility array into a object */
        let jobAccessibility = {}
        data.jobAccessibility.forEach((key) => {
          jobAccessibility[key] = true
        })

        /* convert accommodationAccessibility array into a object */
        let accommodationAccessibility = {}
        data.accommodationAccessibility.forEach((key) => {
          accommodationAccessibility[key] = true
        })

        formData["selectiveProcessAccessibility"] =
          selectiveProcessAccessibility
        formData["jobAccessibility"] = jobAccessibility
        formData["accommodationAccessibility"] = accommodationAccessibility

        await reset(formData)
        setInitialLoading(false)
      }
    }

    defineFormInfo()
  }, [data, status, vacancyId, reset])

  async function fetchVacancy() {
    try {
      const data = await getVacancy(vacancyId)
      return data
    } catch (error) {
      console.error("Error fetching vacancy: ", error)
      return {}
    }
  }

  function goBack() {
    navigate(-1)
  }

  async function refetchRelatedData() {
    await queryClient.invalidateQueries(["vacancies"])
    await queryClient.invalidateQueries(["my-vacancies"])
  }

  async function submitCreateForm(values) {
    setIsSubmiting(true)
    try {
      /* format selectiveProcessAccessibility and jobAccessibility fields */
      let interviewKeys = Object.keys(
        values.selectiveProcessAccessibility,
      ).filter((key) => values.selectiveProcessAccessibility[key])
      let workKeys = Object.keys(values.jobAccessibility).filter(
        (key) => values.jobAccessibility[key],
      )

      let vacancy = {
        ...values,
        skills: values.skills,
        selectiveProcessAccessibility: interviewKeys,
        jobAccessibility: workKeys,
      }

      /* format accommodationAccessibility field */
      const accomadationValue = values["accommodationAccessibility"]
      if (!_.isEmpty(accomadationValue)) {
        const accomodationKeys = Object.keys(values.accommodationAccessibility)
        vacancy["accommodationAccessibility"] = accomodationKeys.filter(
          (key) => values.accommodationAccessibility[key],
        )
      } else {
        vacancy["accommodationAccessibility"] = []
      }

      const vacancyResponse = await createVacancy(vacancy)
      await refetchRelatedData()
      setIsSubmiting(false)
      toast.success("A vaga foi cadastrada")
      navigate(`/vagas/vaga/${vacancyResponse.vacancyId}`)
    } catch (error) {
      console.error("Erro ao cadastrar vaga: ", error)
      toast.error("Erro ao cadastrar vaga")
      setIsSubmiting(false)
    }
  }

  async function submitEditForm(values) {
    setIsSubmiting(true)
    try {
      /* format selectiveProcessAccessibility and jobAccessibility fields */
      let interviewKeys = Object.keys(
        values.selectiveProcessAccessibility,
      ).filter((key) => values.selectiveProcessAccessibility[key])
      let workKeys = Object.keys(values.jobAccessibility).filter(
        (key) => values.jobAccessibility[key],
      )

      let vacancy = {
        ...values,
        skills: values.skills,
        selectiveProcessAccessibility: interviewKeys,
        jobAccessibility: workKeys,
      }

      /* format accommodationAccessibility field */
      const accomadationValue = values["accommodationAccessibility"]
      console.log("accomadationValue", accomadationValue)
      if (
        !_.isEmpty(accomadationValue) ||
        (Array.isArray(accomadationValue) && !_.isEmpty(accomadationValue[0]))
      ) {
        const accomodationKeys = Object.keys(values.accommodationAccessibility)
        vacancy["accommodationAccessibility"] = accomodationKeys.filter(
          (key) => values.accommodationAccessibility[key],
        )
      } else {
        vacancy["accommodationAccessibility"] = []
      }

      await editVacancy(vacancyId, vacancy)
      await refetchRelatedData()
      await queryClient.invalidateQueries(["vacancy", vacancyId])
      setIsSubmiting(false)
      toast.success("As alterações foram salvas")
      navigate(`/vagas/vaga/${vacancyId}`)
    } catch (error) {
      setIsSubmiting(false)
      toast.error("Erro ao salvar alterações")
      console.error("Erro ao cadastrar vaga: ", error)
    }
  }

  function returnContent() {
    switch (currentStep) {
      case 1:
        return (
          <InitialInfo
            onConfirm={() => {
              setCurrentStep(2)
            }}
          />
        )
      case 2:
        return (
          <JobDescription
            goBack={() => setCurrentStep(1)}
            onConfirm={() => setCurrentStep(3)}
          />
        )
      case 3:
        return (
          <AccessibilityInfo
            isEdit={vacancyId}
            isSubmiting={isSubmiting}
            goBack={() => setCurrentStep(2)}
            onConfirm={vacancyId ? submitEditForm : submitCreateForm}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="register-job">
      <div className="register-job__container">
        <Menu />
        {(isLoading || initialLoading) && (
          <main className="register-job__main">
            <SkeletonBody />
          </main>
        )}
        {!isLoading && !initialLoading && (
          <main className="register-job__main">
            <header>
              <div>
                <div className="register-job__container-title">
                  <button
                    type="button"
                    onClick={goBack}
                    aria-label="Voltar para página anterior"
                  >
                    <ArrowLeftCircle size={24} />
                  </button>
                  <h1>{vacancyId ? "Editar" : "Cadastrar"} vaga</h1>
                </div>
                <Chip
                  backgroundColor="#1687c0"
                  color="#040404"
                  borderColor="#1687c0"
                >
                  <Lightbulb size={16} style={{ marginBottom: 1 }} />
                  <span style={{ fontWeight: 500, marginTop: 1 }}>
                    Dica: Seja descritivo!
                  </span>
                </Chip>
              </div>
              <div className="register-job__step-container">
                <StepProgress steps={3} currentStep={currentStep} />
              </div>
            </header>
            <FormProvider {...methods}>{returnContent()}</FormProvider>
          </main>
        )}
      </div>
    </div>
  )
}

export default RegisterJob
