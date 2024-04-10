import { useRef, useState } from "react"
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop"
import { Reply, Scissors, X } from "lucide-react"

// Components
import Dialog from "../Dialog"
import Button from "../Button"

// Styles
import "./index.scss"
import "react-image-crop/src/ReactCrop.scss"
import Compressor from "compressorjs"
import { Oval } from "react-loader-spinner"
import { useMedia } from "../../hooks/useMedia"

const ASPECT_RATIO = 1
const MIN_DIMENSION = 150

function DialogHeader({ onClose }) {
  return (
    <header className="image-crop__dialog-header">
      <h2>Selecionar imagem</h2>
      <button onClick={onClose}>
        <X />
      </button>
    </header>
  )
}

function DialogContent({
  orignalFileRaw,
  src,
  filename,
  onSaveFile,
  alt,
  circularCrop,
  isLoadingCropping,
  onClose,
  setIsLoadingCropping,
  setIsLoadingSelectedFile,
}) {
  const [crop, setCrop] = useState()
  const [cropping, setCropping] = useState(false)

  const imgRef = useRef(null)

  function onSubmit() {
    setIsLoadingCropping(true)
    if (cropping) {
      setTimeout(() => {
        onSubmitCrop(
          convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height),
          filename,
        )
      }, 200)
    } else {
      onSubmitOriginalImage()
    }
  }

  function onSubmitOriginalImage() {
    new Compressor(orignalFileRaw, {
      quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
      success: (compressedResult) => {
        // compressedResult has the compressed file.
        onSaveFile(compressedResult)
      },
      error: (error) => {
        console.log(error)
      },
    })
  }

  async function onSubmitCrop(imageCrop, fileName) {
    if (!imageCrop) return

    try {
      // const fileNameSplitted = filename.split(".")
      // const fileType = fileNameSplitted[fileNameSplitted.length - 1]

      // create a canvas element to draw the cropped image
      const canvas = document.createElement("canvas")

      // get the image element
      const image = imgRef.current

      // draw the image on the canvas
      if (image) {
        const crop = imageCrop
        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height
        const ctx = canvas.getContext("2d")
        const pixelRatio = window.devicePixelRatio
        canvas.width = crop.width * pixelRatio * scaleX
        canvas.height = crop.height * pixelRatio * scaleY

        if (ctx) {
          ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
          ctx.imageSmoothingQuality = "low"

          ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY,
          )
        }

        const blobImage = await new Promise((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                blob.name = fileName
                resolve(blob)
              } else {
                reject(new Error("Error creating blob"))
              }
            },
            "image/jpeg",
            0.7,
          )
        })

        if (blobImage) {
          const file = new File([blobImage], fileName, { type: blobImage.type })

          new Compressor(file, {
            quality: 0.6, // 0.6 can also be used, but its not recommended to go below.
            success: (compressedResult) => {
              // compressedResult has the compressed file.
              onSaveFile(compressedResult)
            },
            error: (error) => {
              throw new Error(error)
            },
          })
        }
      }
    } catch (error) {
      console.log(error)
      setIsLoadingCropping(false)
    }
  }

  function onLoadImage(event) {
    const { width, height } = event.currentTarget
    const cropWidthInPercentage = (MIN_DIMENSION / width) * 100

    const newCrop = makeAspectCrop(
      { unit: "%", width: cropWidthInPercentage },
      ASPECT_RATIO,
      width,
      height,
    )
    const centeredCrop = centerCrop(newCrop, width, height)
    setCrop(centeredCrop)
    if (setIsLoadingSelectedFile) {
      setIsLoadingSelectedFile(false)
    }
  }

  return (
    <main className="image-crop__dialog-content">
      <div className="image-crop__dialog-content__container">
        {cropping ? (
          <ReactCrop
            crop={crop}
            keepSelection
            aspect={ASPECT_RATIO}
            minWidth={MIN_DIMENSION}
            circularCrop={circularCrop}
            onChange={(pixelCrop, percentageCrop) => setCrop(percentageCrop)}
          >
            <img
              ref={imgRef}
              src={src}
              alt={alt}
              onLoad={onLoadImage}
              style={{
                width: "100%",
                height: "100%",
                maxHeight: "calc(70vh - 134px)",
                objectFit: "contain",
              }}
            />
          </ReactCrop>
        ) : (
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            onLoad={onLoadImage}
            style={{
              width: "100%",
              height: "100%",
              maxHeight: "calc(70vh - 134px)",
              objectFit: "contain",
            }}
          />
        )}
      </div>
      <div className="image-crop__dialog-content__buttons">
        <Button
          styleType="outlined"
          style={{
            width: "fit-content",
            height: 40,
            borderColor: "#6d6d6d",
            color: "#6d6d6d",
          }}
          type="button"
          disabled={isLoadingCropping}
          onClick={() => setCropping((prev) => !prev)}
        >
          {cropping ? "Manter original" : "Recortar imagem"}
          {cropping ? (
            <Reply size={16} style={{ marginLeft: 2 }} />
          ) : (
            <Scissors size={16} style={{ marginLeft: 2 }} />
          )}
        </Button>
        <div>
          <Button
            styleType="outlined"
            style={{ width: "fit-content", height: 40 }}
            disabled={isLoadingCropping}
            onClick={onClose}
          >
            Fechar
          </Button>
          <Button
            styleType="contained"
            type="button"
            style={{ width: "fit-content", height: 40 }}
            disabled={isLoadingCropping}
            onClick={onSubmit}
          >
            {!isLoadingCropping && cropping ? "Recortar e salvar" : "Salvar"}
            {isLoadingCropping && (
              <div className="image-crop__dialog-content__loading">
                <Oval
                  visible={true}
                  height="24"
                  width="24"
                  color="#fff"
                  ariaLabel="oval-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </div>
            )}
          </Button>
        </div>
      </div>
    </main>
  )
}

function ImageCrop({
  open,
  orignalFileRaw,
  src,
  filename,
  alt,
  circularCrop = false,
  isLoadingCropping,
  onSaveFile,
  onClose,
  setIsLoadingCropping,
  setIsLoadingSelectedFile,
}) {
  const isMobile = useMedia("(max-width: 720px)")

  return (
    <Dialog
      open={open}
      header={<DialogHeader onClose={onClose} />}
      content={
        <DialogContent
          src={src}
          orignalFileRaw={orignalFileRaw}
          filename={filename}
          alt={alt}
          circularCrop={circularCrop}
          isLoadingCropping={isLoadingCropping}
          onSaveFile={onSaveFile}
          onClose={onClose}
          setIsLoadingCropping={setIsLoadingCropping}
          setIsLoadingSelectedFile={setIsLoadingSelectedFile}
        />
      }
      position={{ top: "50%", left: "50%" }}
      dataSide="center"
      withoutAnimation
      contentStyle={{
        width: "100%",
        height: "100%",
        maxWidth: isMobile ? "80vw" : "60vw",
        maxHeight: isMobile ? "80vh" : "70vh",
        transform: "translate(-50%, -50%)",
        padding: "16px 0px",
      }}
    />
  )
}

export default ImageCrop
