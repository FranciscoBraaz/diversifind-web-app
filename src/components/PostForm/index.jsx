import { forwardRef, useEffect, useRef, useState } from "react"
import { Oval, RotatingLines } from "react-loader-spinner"
import { Image, X } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

// Utils
import { parseLocalStorageJson } from "../../utils"

// Services
import { createPost, editPost } from "../../services/postServices"

//Components
import Avatar from "../Avatar"
import ImageCrop from "../ImageCrop"
import Button from "../Button"
import Dialog from "../Dialog"
import UnlimitedTextarea from "../UnlimitedTextarea"

// Styles
import "./index.scss"

const DialogTrigger = forwardRef(({ onClick, ...props }, ref) => {
  return (
    <button
      className="post-form__dialog-trigger"
      ref={ref}
      onClick={onClick}
      {...props}
    >
      <span>Compartilhe algo com sua rede</span>
      <Image />
    </button>
  )
})
DialogTrigger.displayName = "DialogTrigger"

function DialogHeader({ onClose }) {
  const user = parseLocalStorageJson("diversiFindUser")

  return (
    <header className="dialog-header">
      <div>
        <Avatar src={user.avatar} alt={`Foto de perfil ${user.name}`} />
        <p>{user.name}</p>
      </div>
      <button onClick={onClose} aria-label="Fechar modal">
        <X />
      </button>
    </header>
  )
}

function DialogContent({
  text,
  textImgDescription,
  fileCrop,
  type = "create",
  mediaChanged,
  postId,
  pageIndex,
  postIndex,
  onClose,
  isLoadingSelectedFile,
  onOpenImageCrop,
  setIsLoadingSelectedFile,
  onCloseImageCrop,
  setMediaChanged,
}) {
  const queryClient = useQueryClient()

  const textAreaRef = useRef()
  const wrapperRef = useRef(null)
  const inputFileRef = useRef(null)

  const [inputValue, setInputValue] = useState(text ?? "")
  const [mediaDescription, setMediaDescription] = useState(
    textImgDescription ?? "",
  )
  const [file, setFile] = useState(null)
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)

  const methods = {
    create: handleCreatePost,
    edit: handleEditPost,
  }

  useEffect(() => {
    if (fileCrop) {
      setFile({
        name: fileCrop.name,
        preview: URL.createObjectURL(fileCrop),
        raw: fileCrop,
      })
    }
  }, [fileCrop])

  useEffect(() => {
    const imageDescriptionElement = document.getElementById("image-description")

    if (imageDescriptionElement) {
      setTimeout(() => {
        imageDescriptionElement.focus()
      }, 200)
    }
  }, [file])

  useEffect(() => {
    const currentTextArea = textAreaRef?.current
    const currentWrapper = wrapperRef?.current

    if (currentTextArea) {
      currentWrapper.dataset.replicatedValue = currentTextArea.value
    }
  }, [inputValue])

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
      onOpenImageCrop(reader.result?.toString(), formattedName, newFile)
    })
    reader.readAsDataURL(file)
    inputFileRef.current.value = null
  }

  function handleOnClickChooseFile(evt) {
    evt.preventDefault()
    inputFileRef.current.click()
  }

  function handleRemoveFile() {
    setFile(null)
    setMediaChanged(true)
  }

  async function handleCreatePost(event) {
    event.preventDefault()
    if (file?.raw && !mediaDescription) {
      toast.info("Adicione uma descrição para a imagem")
      const imageDescriptionElement =
        document.getElementById("image-description")
      if (imageDescriptionElement) {
        imageDescriptionElement.focus()
      }
      return
    }

    try {
      setIsLoadingSubmit(true)
      const formData = new FormData()
      formData.append("content", inputValue)
      if (file?.raw) {
        formData.append("file", file.raw)
        formData.append("mediaDescription", mediaDescription)
      }

      const { post } = await createPost(formData)
      queryClient.setQueryData(["feed"], (oldData) => {
        if (oldData && oldData.pages.length > 0) {
          let newFirstPage = [post, ...oldData.pages[0].posts]
          let newData = [
            { posts: newFirstPage, total: oldData.pages[0].total },
            ...oldData.pages.slice(1),
          ]

          return { pages: newData, pageParams: oldData.pageParams }
        }

        let newFirstPage = { posts: [post], total: 1 }
        return { pages: newFirstPage, pageParams: oldData.pageParams }
      })

      setIsLoadingSubmit(false)
      toast.success("Publicação criada")
      onClose()
    } catch (error) {
      // console.log(error)
      toast.error("Houve um erro ao enviar publicação")
      setIsLoadingSubmit(false)
    }
  }

  async function handleEditPost(event) {
    event.preventDefault()

    try {
      setIsLoadingSubmit(true)
      const formData = new FormData()
      formData.append("content", inputValue)
      formData.append("postId", postId)

      if (mediaChanged && file?.raw) {
        formData.append("file", file.raw)
        formData.append("mediaDescription", mediaDescription)
      }

      if (mediaChanged && !file?.raw) {
        formData.append("mediaRemoved", true)
      }

      const { post: newPost } = await editPost(formData)

      queryClient.setQueryData(["feed"], (oldData) => {
        const beforePages = oldData.pages.slice(0, pageIndex)
        const afterPages = oldData.pages.slice(pageIndex + 1)
        let currentPage = oldData.pages[pageIndex]

        currentPage = {
          ...currentPage,
          posts: currentPage.posts.map((post, index) => {
            if (index === postIndex) {
              return {
                ...newPost,
              }
            }

            return post
          }),
        }

        return {
          ...oldData,
          pages: [...beforePages, currentPage, ...afterPages],
        }
      })

      setIsLoadingSubmit(false)
      toast.success("As alterações foram salvas")
      onClose()
    } catch (error) {
      // console.log(error)
      toast.error("Houve um erro salvar as alterações")
      setIsLoadingSubmit(false)
    }
  }

  return (
    <form
      className="post-content"
      onSubmit={inputValue ? methods[type] : undefined}
    >
      <div className="post-content__container">
        <UnlimitedTextarea
          value={inputValue ?? ""}
          shouldFocus
          onChangeValue={(value) => setInputValue(value)}
          name="post-text"
          id="post-text"
          placeholder="O que você quer compartilhar?"
        />
        {file?.preview && (
          <div className="post__image-preview">
            <button onClick={handleRemoveFile} aria-label="Remover foto">
              <X />
            </button>
            <img
              width={600}
              alt={"Previsão da imagem"}
              src={file.preview}
              onLoad={onCloseImageCrop}
            />
          </div>
        )}
        {file?.preview && (
          <UnlimitedTextarea
            value={mediaDescription ?? ""}
            shouldFocus={false}
            onChangeValue={(value) => setMediaDescription(value)}
            name="image-description"
            id="image-description"
            withLabel
            placeholder="Adicione uma descrição para a imagem"
          />
        )}
      </div>
      <footer>
        <button
          type="button"
          onClick={handleOnClickChooseFile}
          aria-label="Adicionar imagem"
        >
          <Image />
        </button>
        <input
          ref={inputFileRef}
          className="post__input-file"
          type="file"
          aria-label="Input para adicionar imagem"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleOnChangeFile}
        />
        <Button
          styleType="contained"
          style={{ width: 120 }}
          type="submit"
          disabled={(!inputValue && !file?.raw) || isLoadingSubmit}
        >
          {isLoadingSubmit ? (
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
            "Publicar"
          )}
        </Button>
      </footer>
      {isLoadingSelectedFile && (
        <div className="new-post__loading-selected-file">
          <p>Carregando imagem</p>
          <RotatingLines
            visible={true}
            height="36"
            width="36"
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      )}
    </form>
  )
}

function PostForm({
  text,
  textImgDescription,
  sourceUrl,
  cloudinaryId,
  postId,
  pageIndex,
  postIndex,
  isEditing = false,
  modalIsOpen,
  withTrigger = false,
  setModalIsOpen,
}) {
  const [imageCropOpen, setImageCropOpen] = useState(false)
  const [originalFile, setOriginalFile] = useState(null)
  const [croppedFile, setCroppedFile] = useState(null)
  const [isLoadingSelectedFile, setIsLoadingSelectedFile] = useState(false)
  const [isLoadingCropping, setIsLoadingCropping] = useState(false)
  const [mediaChanged, setMediaChanged] = useState(false)

  useEffect(() => {
    async function transformUrlInFile() {
      setIsLoadingSelectedFile(true)
      try {
        const response = await fetch(sourceUrl)
        const blob = await response.blob()
        const file = new File([blob], cloudinaryId, { type: blob.type })
        setCroppedFile(file)
      } catch (error) {
        // console.log(error)
      }
    }

    if (sourceUrl && modalIsOpen) {
      transformUrlInFile()
    }
  }, [sourceUrl, cloudinaryId, modalIsOpen])

  function handleOpenImageCrop(fileAsDataUrl, name, raw) {
    setOriginalFile({ content: fileAsDataUrl, name, raw })
    setIsLoadingSelectedFile(false)
    setImageCropOpen(true)
  }

  function handleOnCloseImageCrop() {
    // setCroppedFile(null)
    setIsLoadingCropping(false)
    setImageCropOpen(false)
    setIsLoadingSelectedFile(false)
  }

  function handleSaveFileCrop(file) {
    setCroppedFile(file)
    setMediaChanged(true)
  }

  function handleClose() {
    setCroppedFile(null)
    setOriginalFile(null)
    setModalIsOpen(false)
  }

  return (
    <>
      <Dialog
        open={modalIsOpen}
        trigger={
          withTrigger ? (
            <DialogTrigger onClick={() => setModalIsOpen(true)} />
          ) : undefined
        }
        header={<DialogHeader onClose={handleClose} />}
        content={
          <DialogContent
            text={text}
            textImgDescription={textImgDescription}
            fileCrop={croppedFile}
            type={isEditing ? "edit" : "create"}
            mediaChanged={mediaChanged}
            postId={postId}
            pageIndex={pageIndex}
            postIndex={postIndex}
            isLoadingSelectedFile={isLoadingSelectedFile}
            onClose={handleClose}
            onOpenImageCrop={handleOpenImageCrop}
            onCloseImageCrop={handleOnCloseImageCrop}
            setIsLoadingSelectedFile={setIsLoadingSelectedFile}
            setMediaChanged={setMediaChanged}
          />
        }
        position={{ top: "50%", left: "50%" }}
        dataSide="center"
        withoutAnimation
        contentStyle={{
          maxWidth: 555,
          maxHeight: 560,
          transform: "translate(-50%, -50%)",
          padding: "16px 0px",
        }}
        overlayColor="rgba(0, 0, 0, 0.3)"
      />
      <ImageCrop
        open={imageCropOpen}
        orignalFileRaw={originalFile?.raw}
        src={originalFile?.content}
        filename={originalFile?.name}
        alt={originalFile?.name}
        onSaveFile={handleSaveFileCrop}
        isLoadingCropping={isLoadingCropping}
        onClose={() => setImageCropOpen(false)}
        setIsLoadingCropping={setIsLoadingCropping}
      />
    </>
  )
}

export default PostForm
