import { useState } from "react"
import { X } from "lucide-react"
import { Rating } from "react-simple-star-rating"
import { toast } from "react-toastify"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// Services
import { rateCommunity } from "../../services/communityService"

// Components
import Dialog from "../Dialog"
import Button from "../Button"

// Styles
import "./index.scss"

function DialogHeader({ isLoading, onClose }) {
  return (
    <div className="rating-modal__dialog-header">
      <h2>Avaliar comunidade</h2>
      <button onClick={isLoading ? undefined : onClose} disabled={isLoading}>
        <X />
      </button>
    </div>
  )
}

function DialogContent({ isLoading, onClose, onConfirm }) {
  const [rate, setRate] = useState(0)

  return (
    <main className="rating-modal__dialog-content">
      <p>Com base na sua experiência avalie esta comunidade</p>
      <div>
        <Rating initialValue={rate} onClick={(value) => setRate(value)} />
      </div>
      <footer>
        <Button
          styleType="outlined"
          style={{ width: "fit-content" }}
          disabled={isLoading}
          onClick={onClose}
        >
          Cancelar
        </Button>
        <Button
          styleType="contained"
          style={{ width: "fit-content" }}
          isLoading={isLoading}
          onClick={() => onConfirm(rate)}
        >
          Avaliar
        </Button>
      </footer>
    </main>
  )
}

function RatingModal({ open, communityId, onClose }) {
  const queryClient = useQueryClient()

  const handleRating = useMutation({
    mutationFn: async ({ rate, communityId }) => {
      await rateCommunity(rate, communityId)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["communities"])
      toast.success("Avaliação enviada")
      onClose()
    },
    onError: (error) => {
      console.error("Erro ao avaliar comunidade: ", error)
      toast.error("Erro ao enviar avaliação")
    },
  })

  return (
    <Dialog
      open={open}
      header={
        <DialogHeader isLoading={handleRating.isPending} onClose={onClose} />
      }
      content={
        <DialogContent
          onClose={onClose}
          isLoading={handleRating.isPending}
          onConfirm={(rate) => handleRating.mutate({ rate, communityId })}
        />
      }
      position={{ top: "50%", left: "50%" }}
      dataSide="center"
      withoutAnimation
      overlayColor="rgba(0, 0, 0, 0.5)"
      contentStyle={{
        width: "100%",
        height: "100%",
        maxWidth: "574px",
        maxHeight: "300px",
        transform: "translate(-50%, -50%)",
        padding: "16px 0px",
      }}
    />
  )
}

export default RatingModal
