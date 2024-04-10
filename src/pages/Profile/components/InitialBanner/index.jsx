import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowUpRightSquare,
  Pencil,
  MessageSquareText,
  UserPlus,
  UserMinus,
} from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"

// Schemas
import { basicInfoFields, sendMessageFields } from "./formFields"

// Utils
import { parseLocalStorageJson } from "../../../../utils"

// Services
import {
  addNewFollow,
  removeFollow,
  updateAvatar,
  updateBasicInfo,
} from "../../../../services/authServices"
import { sendMessage } from "../../../../services/messageService"

// Components
import Avatar from "../../../../components/Avatar"
import ModalForm from "../ModalForm"
import ImageCrop from "../../../../components/ImageCrop"
import LoadingDialog from "../../../../components/LoadingDialog"
import UploadResume from "../UploadResume"
import Button from "../../../../components/Button"

//Styles
import "./index.scss"

function InitialBanner({ user, loggedUserNetwork }) {
  const inputFileRef = useRef(null)
  const [showModal, setShowModal] = useState(null)
  const [originalFile, setOriginalFile] = useState(null)
  const [isLoadingSelectedFile, setIsLoadingSelectedFile] = useState(false)
  const [isLoadingCropping, setIsLoadingCropping] = useState(false)
  const userLogged = parseLocalStorageJson("diversiFindUser")
  const isProfileOwner = userLogged._id === user._id

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const submitForm = useMutation({
    mutationFn: async (values) => {
      const data = await updateBasicInfo(values)
      return data
    },
    onSuccess: async (data) => {
      await queryClient.refetchQueries(["user-info", user._id])
      window.localStorage.setItem("diversiFindUser", JSON.stringify(data.user))
      setShowModal("")
      toast.success("Informações atualizadas")
    },
    onError: (error) => {
      console.error(error)
      toast.error("Erro ao atualizar informações")
    },
  })

  const submitMessage = useMutation({
    mutationFn: async (values) => {
      const newMessage = await sendMessage(user._id, values.newMessage)
      return newMessage
    },
    onSuccess: async (newMessage) => {
      setShowModal("")
      await queryClient.invalidateQueries(["conversations"])
      dispatch({
        type: "CHANGE_CONVERSATION_ID",
        payload: newMessage.conversationId,
      })
      navigate("/mensagens")
    },
    onError: (error) => {
      console.error(error)
    },
  })

  const handleFollow = useMutation({
    mutationFn: async ({ userToFollowId }) => {
      await addNewFollow(userToFollowId)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["user-network-info"])
      await queryClient.invalidateQueries(["logged-user-info"])
      toast.success("Agora você está seguindo esta pessoa")
    },
    onError: () => {
      // console.log(error)
      toast.error("Erro ao adicionar seguidor")
    },
  })

  const handleUnfollow = useMutation({
    mutationFn: async ({ followerId }) => {
      await removeFollow(followerId)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["user-network-info"])
      await queryClient.invalidateQueries(["logged-user-info"])
      toast.success("Você deixou de seguir esta pessoa")
    },
    onError: () => {
      // console.log(error)
      toast.error("Erro ao remover seguidor")
    },
  })

  async function handleSaveFileCrop(file) {
    try {
      const formData = new FormData()
      formData.append("file", file)
      const data = await updateAvatar(formData)
      await queryClient.refetchQueries(["user-info", user._id])

      window.localStorage.setItem("diversiFindUser", JSON.stringify(data.user))
      setIsLoadingCropping(false)
      toast.success("Foto de perfil atualizada")
      setShowModal("")
    } catch (error) {
      // console.log(error)
      toast.error("Erro ao atualizar foto de perfil")
    }
  }

  function handleOnChangeFile(evt) {
    setIsLoadingSelectedFile(true)
    const { files } = evt.target
    evt.preventDefault()
    const file = files[0]
    const fileExtension = file.name.split(".").pop()
    const fileName = file.name
      .replace(`.${fileExtension}`, "")
      .replace(/[^a-zA-Z0-9_-]/g, "")

    const formattedName = `${fileName}.${fileExtension}`
    const blob = file.slice(0, file.size, file.type)
    const newFile = new File([blob], formattedName, { type: file.type })

    const reader = new FileReader()
    reader.addEventListener("load", () => {
      setOriginalFile({
        content: reader.result?.toString(),
        name: formattedName,
        raw: newFile,
      })
      setShowModal("edit-avatar")
    })
    reader.readAsDataURL(file)
    inputFileRef.current.value = null
  }

  function handleOnClickChooseFile(evt) {
    evt.preventDefault()
    inputFileRef.current.click()
  }

  function handleOpenResume() {
    window.open(user.resumeUrl, "_blank")
  }

  function handleOpenSendMessage() {
    setShowModal("send-message")
  }

  const defaultValues = {
    name: user?.name,
    headline: user?.headline,
    city: user?.city,
    stateUf: user?.stateUf,
  }

  const userAlreadyFollowed = loggedUserNetwork?.following?.includes(user._id)

  return (
    <section className="initial-banner" id="initial-banner">
      <div className="initial-banner__infos-container">
        <input
          ref={inputFileRef}
          aria-label="Escolher arquivo para foto de perfil"
          className="initial-banner__input-file"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleOnChangeFile}
        />
        <Avatar
          src={user.avatar}
          alt={user.name}
          // style={{ width: 110, height: 110 }}
          canEdit={isProfileOwner}
          onEdit={handleOnClickChooseFile}
        />
        <div className="initial-banner__profile-info">
          <h1>{user.name}</h1>
          <p>{user.headline}</p>
          <p>{user.city ? `${user.city} - ${user.stateUf}` : "-"}</p>
        </div>
        {!userAlreadyFollowed && !isProfileOwner && (
          <Button
            onClick={() => handleFollow.mutate({ userToFollowId: user._id })}
            isLoading={handleFollow.isPending}
            style={{ width: "fit-content", height: 35, gap: 8 }}
            rightIcon={<UserPlus />}
          >
            Seguir
          </Button>
        )}
        {userAlreadyFollowed && !isProfileOwner && (
          <Button
            onClick={() => handleUnfollow.mutate({ followerId: user._id })}
            isLoading={handleUnfollow.isPending}
            style={{ width: "fit-content", height: 35, gap: 8 }}
            rightIcon={<UserMinus />}
          >
            Deixar de seguir
          </Button>
        )}
      </div>
      <footer>
        {!isProfileOwner && (
          <Button
            styleType="outlined"
            onClick={handleOpenSendMessage}
            style={{ width: "fit-content", height: 35, gap: 8 }}
            rightIcon={<MessageSquareText />}
          >
            Enviar mensagem
          </Button>
        )}
        <div className="initial-banner__action-buttons">
          {user.resumeUrl && (
            <Button
              styleType="contained"
              onClick={handleOpenResume}
              style={{ width: "fit-content", height: 35, gap: 8 }}
              rightIcon={<ArrowUpRightSquare />}
            >
              Visualizar currículo
            </Button>
          )}
          {isProfileOwner && (
            <UploadResume
              text={user.resumeUrl ? "Atualizar CV" : "Enviar currículo"}
              icon={user.resumeUrl ? "RefreshCcw" : "Upload"}
              userId={user._id}
            />
          )}
        </div>
      </footer>
      {isProfileOwner && (
        <button
          className="profile__action-button-section"
          aria-label="Editar informações básicas"
          id="edit-initial-info"
          onClick={() => setShowModal("edit-basic-info")}
        >
          <Pencil />
        </button>
      )}
      <ModalForm
        title="Informações básicas"
        formFields={basicInfoFields}
        open={showModal === "edit-basic-info"}
        isLoading={submitForm.isPending}
        defaultValues={defaultValues}
        onClose={() => setShowModal(false)}
        onConfirm={submitForm.mutate}
        maxHeight="60vh"
        ariaLabelReference="edit-initial-info"
      />
      <ModalForm
        title="Enviar mensagem"
        formFields={sendMessageFields}
        open={showModal === "send-message"}
        isLoading={submitMessage.isPending}
        defaultValues={defaultValues}
        onClose={() => setShowModal(false)}
        onConfirm={submitMessage.mutate}
        onConfirmTitle="Enviar"
        maxHeight="70vh"
      />
      <ImageCrop
        open={showModal === "edit-avatar"}
        orignalFileRaw={originalFile?.raw}
        src={originalFile?.content}
        filename={originalFile?.name}
        alt={originalFile?.name}
        circularCrop
        onSaveFile={handleSaveFileCrop}
        isLoadingCropping={isLoadingCropping}
        onClose={() => {
          setShowModal(null)
          setIsLoadingSelectedFile(false)
        }}
        setIsLoadingCropping={setIsLoadingCropping}
        setIsLoadingSelectedFile={setIsLoadingSelectedFile}
      />
      <LoadingDialog open={isLoadingSelectedFile} />
    </section>
  )
}

export default InitialBanner
