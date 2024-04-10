import { useRef } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

// Utils
import { parseLocalStorageJson } from "../../../../utils"

// Services
import { updateResume } from "../../../../services/authServices"

// Components
import Button from "../../../../components/Button"
import CustomIcon from "../../../../components/CustomIcon"

// Styles
import "./index.scss"

function UploadResume({ text, icon, userId, customAction }) {
  const user = parseLocalStorageJson("diversiFindUser")

  const queryClient = useQueryClient()
  const inputFileRef = useRef(null)

  const submitResume = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData()
      formData.append("file", file)
      const { resumeUrl } = await updateResume(formData)
      return resumeUrl
    },
    onSuccess: async (resumeUrl) => {
      const newUserInfo = {
        ...user,
        resumeUrl,
      }

      if (customAction) {
        customAction(resumeUrl)
      }
      localStorage.setItem("diversiFindUser", JSON.stringify(newUserInfo))
      await queryClient.refetchQueries(["user-info", userId])
      toast.success("O currículo foi salvo")
    },
    onError: (error) => {
      console.error(error)
      toast.error("Erro ao salvar o currículo")
    },
  })

  function handleOnChangeFile(evt) {
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
    submitResume.mutate(newFile)

    inputFileRef.current.value = null
  }

  function handleOnClickChooseFile(evt) {
    evt.preventDefault()
    inputFileRef.current.click()
  }

  return (
    <div className="upload-resume">
      <input
        ref={inputFileRef}
        aria-label="Escolher arquivo"
        className="upload-resume__input-file"
        type="file"
        accept="application/pdf"
        onChange={handleOnChangeFile}
      />
      <Button
        styleType="outlined"
        style={{ width: "fit-content", height: 35, gap: 8 }}
        rightIcon={<CustomIcon icon={icon} style={{ width: 18, height: 18 }} />}
        disabled={submitResume.isPending}
        onClick={handleOnClickChooseFile}
      >
        {submitResume.isPending ? "Enviando currículo..." : text}
      </Button>
    </div>
  )
}

export default UploadResume
