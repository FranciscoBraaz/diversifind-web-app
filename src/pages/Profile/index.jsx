import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import Skeleton from "react-loading-skeleton"

// Services
import { getNetworkingUserInfo, getUser } from "../../services/authServices"

// Assets
import ErrorSvg from "../../assets/error.svg?react"

// Utils
import { parseLocalStorageJson } from "../../utils"

// Components
import Menu from "../../components/Menu"
import AcademicEducationSection from "./components/AcademicEducationSection"
import ExperienceSection from "./components/ExperienceSection"
import InitialBanner from "./components/InitialBanner"
import AboutSection from "./components/AboutSection"
import CertificateSection from "./components/CertificateSection"

import "./index.scss"
import "react-loading-skeleton/dist/skeleton.css"

function SkeletonBody() {
  return (
    <div className="profile__skeleton">
      <section className="profile__skeleton__initial-banner">
        <div>
          <Skeleton style={{ width: 110, height: 110, borderRadius: "50%" }} />
        </div>
        <div>
          <Skeleton style={{ width: "60%", height: 30 }} />
          <Skeleton style={{ width: "50%", height: 25 }} />
          <Skeleton style={{ width: "30%", height: 20 }} />
        </div>
      </section>
      <section className="profile__skeleton__about">
        <Skeleton style={{ width: "30%", height: 30 }} />
        <Skeleton style={{ width: "100%", height: 120 }} />
      </section>
      <section className="profile__skeleton__experiences">
        <Skeleton style={{ width: "30%", height: 25 }} />
        <div className="profile__skeleton__experience-item">
          <div>
            <Skeleton style={{ width: 40, height: 40, borderRadius: "50%" }} />
          </div>
          <div>
            <Skeleton style={{ width: "60%", height: 15 }} />
            <Skeleton style={{ width: "50%", height: 15 }} />
            <Skeleton style={{ width: "80%", height: 15 }} />
            <Skeleton style={{ width: "80%", height: 15 }} />
          </div>
        </div>
      </section>
      <section className="profile__skeleton__experiences">
        <Skeleton style={{ width: "30%", height: 25 }} />
        <div className="profile__skeleton__experience-item">
          <div>
            <Skeleton style={{ width: 40, height: 40, borderRadius: "50%" }} />
          </div>
          <div>
            <Skeleton style={{ width: "60%", height: 15 }} />
            <Skeleton style={{ width: "50%", height: 15 }} />
            <Skeleton style={{ width: "80%", height: 15 }} />
            <Skeleton style={{ width: "80%", height: 15 }} />
          </div>
        </div>
      </section>
      <section className="profile__skeleton__experiences">
        <Skeleton style={{ width: "30%", height: 25 }} />
        <div className="profile__skeleton__experience-item">
          <div>
            <Skeleton style={{ width: 40, height: 40, borderRadius: "50%" }} />
          </div>
          <div>
            <Skeleton style={{ width: "60%", height: 15 }} />
            <Skeleton style={{ width: "50%", height: 15 }} />
            <Skeleton style={{ width: "80%", height: 15 }} />
            <Skeleton style={{ width: "80%", height: 15 }} />
          </div>
        </div>
      </section>
    </div>
  )
}

function Profile() {
  const user = parseLocalStorageJson("diversiFindUser")
  const { id } = useParams()
  const { isLoading, data, isError } = useQuery({
    queryKey: ["user-info", id],
    queryFn: () => fetchUserInfo(),
    staleTime: Infinity,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: false,
  })

  const {
    isLoading: isLoadingLoggedUser,
    data: dataLoggedUser,
    isError: isErrorLoggedUser,
  } = useQuery({
    queryKey: ["user-network-info", user._id],
    queryFn: () => fetchLoggedUserInfo(),
    staleTime: Infinity,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: false,
  })

  async function fetchLoggedUserInfo() {
    try {
      const data = await getNetworkingUserInfo()

      return data
    } catch (error) {
      toast.error("Erro ao buscar informações do usuário")
      return {}
    }
  }

  async function fetchUserInfo() {
    try {
      const data = await getUser(id)

      return data
    } catch (error) {
      toast.error("Erro ao buscar informações do usuário")
      return {}
    }
  }

  const canEditProfile = user?._id === id

  if (isError || isErrorLoggedUser) {
    return (
      <div className="profile">
        <div className="profile-container">
          <Menu />
          <div className="profile-error">
            <p>Houve um erro ao trazer informações</p>
            <ErrorSvg />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile">
      <div className="profile-container">
        <Menu />
        {(isLoading || isLoadingLoggedUser) && <SkeletonBody />}
        {!isLoading && !isLoadingLoggedUser && (
          <main className="profile__main">
            <InitialBanner
              user={data}
              loggedUserNetwork={dataLoggedUser?.userNetwork}
            />
            {(data?.about || canEditProfile) && (
              <AboutSection userId={data?._id} about={data?.about} />
            )}
            <ExperienceSection
              userId={data?._id}
              experiences={data?.experience}
            />
            <AcademicEducationSection
              userId={data?._id}
              academicEducations={data?.academicEducation}
            />
            <CertificateSection
              userId={data?._id}
              certificates={data?.certificates}
            />
          </main>
        )}
      </div>
    </div>
  )
}

export default Profile
