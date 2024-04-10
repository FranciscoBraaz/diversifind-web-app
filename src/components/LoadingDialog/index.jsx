import { RotatingLines } from "react-loader-spinner"

// Components
import Dialog from "../Dialog"

// Styles
import "./index.scss"

function DialogContent() {
  return (
    <div className="loading-dialog__content">
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
  )
}

function LoadingDialog({ open }) {
  return (
    <Dialog
      open={open}
      content={<DialogContent />}
      position={{ top: "50%", left: "50%" }}
      dataSide="center"
      withoutAnimation
      contentStyle={{
        width: "100%",
        height: "100%",
        maxWidth: "300px",
        maxHeight: "200px",
        transform: "translate(-50%, -50%)",
        padding: "16px 0px",
      }}
    />
  )
}

export default LoadingDialog
