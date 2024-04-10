import { useRef } from "react"

// Styles
import "./index.scss"

function InputFile({ onOpenImageCrop, setIsLoadingSelectedFile }) {
  const inputFileRef = useRef(null)

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

  return (
    <input
      ref={inputFileRef}
      className="input-file"
      type="file"
      accept="image/png, image/jpeg, image/jpg"
      onChange={handleOnChangeFile}
    />
  )
}

export default InputFile
