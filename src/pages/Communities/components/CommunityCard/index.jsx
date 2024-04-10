import { useState } from "react"
import { Rating } from "react-simple-star-rating"
import { CheckCircle2, MoreVertical } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

// Services
import { deleteCommunity } from "../../../../services/communityService"

// Utils
import {
  defineColorConstrast,
  defineItemColor,
  getPassedtime,
  parseLocalStorageJson,
} from "../../../../utils"

// Components
import Chip from "../../../../components/Chip"
import Button from "../../../../components/Button"
import Dropdown from "../../../../components/Dropdown"
import ConfirmationModal from "../../../../components/ConfirmationModal"
import CommunityModal from "../../../../components/CommunityModal"
import RatingModal from "../../../../components/RatingModal"

// Styles
import "./index.scss"
import { useMedia } from "../../../../hooks/useMedia"

const platformsMap = {
  whatsapp: "Whatsapp",
  telegram: "Telegram",
  discord: "Discord",
  facebook: "Facebook",
  linkedin: "Linkedin",
  reddit: "Reddit",
  others: "Outros",
}

function CommunityCard({ community, isOwner = false }) {
  const {
    name,
    description,
    professionalArea,
    skills = [],
    link,
    rating,
    totalRatings,
    platform,
    createdAt,
    ratedUsers = [],
  } = community
  const dropdownOptions = [
    {
      label: "Apagar",
      icon: "Trash2",
      action: () => setShowModal("delete"),
    },
    {
      label: "Editar",
      icon: "Pencil",
      action: () => setShowModal("edit"),
    },
  ]
  const user = parseLocalStorageJson("diversiFindUser")

  const [showModal, setShowModal] = useState("")
  const queryClient = useQueryClient()
  const isMobile = useMedia("(max-width: 720px)")

  const handleDeleteCommunity = useMutation({
    mutationFn: async (community) => {
      await deleteCommunity(community.communityId)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        predicate: (query) =>
          ["my-communities", "communities"].includes(query.queryKey[0]),
      })
      setShowModal("")
      toast.success("Comunidade excluída")
    },
    onError: () => {
      // console.log(error)
      toast.error("Erro ao excluir comunidade")
    },
  })

  function handleNavigateToCommunity() {
    window.open(link, "_blank")
    setShowModal("")
  }

  const chipColor = defineItemColor(professionalArea.name)
  const userAlreadyRate = ratedUsers.includes(user._id)

  return (
    <div className="community-card">
      <header>
        <div>
          <h2>{name}</h2>
          <p>Plataforma: {platformsMap[platform]}</p>
          {isMobile && <span>{getPassedtime(createdAt)}</span>}
          <div className="community-card__rating-container">
            <Rating
              initialValue={totalRatings > 0 ? rating / totalRatings : 0}
              size={20}
              readonly
              allowFraction
            />
            <p>({totalRatings})</p>
          </div>
          <Chip
            style={{ fontSize: 12 }}
            backgroundColor={chipColor}
            borderColor={chipColor}
            color={defineColorConstrast(chipColor)}
          >
            {professionalArea.name}
          </Chip>
        </div>
        <div className="community-card__actions-container">
          <p>{getPassedtime(createdAt)}</p>
          {isOwner && (
            <Dropdown
              options={dropdownOptions}
              width={120}
              buttonLabel="Abrir opções da comunidade"
            >
              <MoreVertical size={22} />
            </Dropdown>
          )}
        </div>
      </header>
      <main>
        <p>{description}</p>
      </main>
      <footer>
        <ul className="community-card__tags">
          {skills.map((skill) => (
            <li key={skill._id}>
              <Chip>{skill.name}</Chip>
            </li>
          ))}
        </ul>
        <div className="community-card__container-buttons">
          {userAlreadyRate && (
            <Button
              styleType="outlined"
              style={{ width: "fit-content" }}
              disabled
              rightIcon={<CheckCircle2 />}
            >
              Avaliada
            </Button>
          )}
          {!userAlreadyRate && (
            <Button
              styleType="outlined"
              style={{ width: "fit-content" }}
              onClick={() => setShowModal("rate")}
            >
              Avaliar
            </Button>
          )}
          <Button
            styleType="contained"
            style={{ width: "fit-content" }}
            onClick={() => setShowModal("confirmRedirect")}
          >
            Acessar
          </Button>
        </div>
      </footer>
      <ConfirmationModal
        open={showModal === "confirmRedirect"}
        options={{
          title: `Comunidade - ${name}`,
          descriptionText:
            "Você será redirecionado (em uma nova aba) para a plataforma da comunidade, deseja continuar?",
          confirmText: "Sim, continuar",
        }}
        onCloseModal={() => setShowModal("")}
        onConfirm={() => handleNavigateToCommunity()}
      />
      <ConfirmationModal
        open={showModal === "delete"}
        type="delete"
        options={{
          title: "Excluir comunidade",
          descriptionText: "Tem certeza que deseja excluir esta comunidade?",
          confirmText: "Excluir",
        }}
        actionIsLoading={handleDeleteCommunity.isPending}
        onCloseModal={() => setShowModal("")}
        onConfirm={() =>
          handleDeleteCommunity.mutate({ communityId: community._id })
        }
      />
      <CommunityModal
        open={showModal === "edit"}
        communityInfo={community}
        isEditing
        onClose={() => setShowModal("")}
      />
      <RatingModal
        open={showModal === "rate"}
        communityId={community._id}
        onClose={() => setShowModal("")}
      />
    </div>
  )
}

export default CommunityCard
