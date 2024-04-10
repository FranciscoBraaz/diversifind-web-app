import { useFormContext } from "react-hook-form"
import { PlusCircle } from "lucide-react"

// Services
import { listProfessionalArea } from "../../../../services/professionalAreaService"

// Components
import UncontrolledCheckbox from "../../../../components/UncontrolledCheckbox"
import UncontrolledSelectDefault from "../../../../components/UncontrolledSelectDefault"
import Button from "../../../../components/Button"

// Styles
import "./index.scss"

const buttonStyle = {
  height: "25px",
  width: "fit-content",
  fontSize: 14,
  lineHeight: "14px",
  padding: "0px",
  border: "none",
  color: "#007674",
}

function Filters({ onClickAction, hasCommunityButton, marginTop }) {
  const {
    register,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useFormContext()

  return (
    <aside className="communities__filters">
      {hasCommunityButton && (
        <Button
          styleType="contained"
          style={{ gap: "8px" }}
          rightIcon={<PlusCircle size={18} />}
          onClick={onClickAction}
        >
          Cadastrar comunidade
        </Button>
      )}
      <header style={marginTop ? { marginTop } : {}}>
        <h2>Filtros</h2>
        <Button style={buttonStyle} onClick={() => reset()}>
          Limpar filtros
        </Button>
      </header>
      <div className="communities__filters__separator" />
      <div className="communities__filters__sections-container">
        <section className="communities__filters__sort-type">
          <header>
            <h3>Ordenação</h3>
          </header>
          <UncontrolledSelectDefault
            getValues={getValues}
            setValue={setValue}
            formField={{
              name: "sortType",
              withoutLabel: true,
              hasTransparent: true,
              options: [
                { value: "relevance", label: "Relevância" },
                { value: "recent", label: "Recentes" },
              ],
            }}
            errors={errors}
          />
        </section>
        <section className="communities__filters__occupation-area">
          <header>
            <h3>Área profissional</h3>
            <Button
              style={buttonStyle}
              onClick={() => setValue("professionalArea", "")}
            >
              Limpar
            </Button>
          </header>
          <UncontrolledSelectDefault
            getValues={getValues}
            setValue={setValue}
            getOprions
            formField={{
              name: "professionalArea",
              options: [],
              route: "/list",
              withoutLabel: true,
              hasTransparent: true,
              getOptions: listProfessionalArea,
            }}
            errors={errors}
          />
        </section>
        <div className="communities__filters__sections-container">
          <section className="communities__filters__platforms">
            <header>
              <h3>Plataforma</h3>
              <Button
                style={buttonStyle}
                onClick={() =>
                  setValue("platforms", {
                    whatsapp: false,
                    telegram: false,
                    discord: false,
                    facebook: false,
                    reddit: false,
                    linkedin: false,
                  })
                }
              >
                Limpar
              </Button>
            </header>
            <UncontrolledCheckbox
              formField={{ name: "platforms.whatsapp", label: "Whatsapp" }}
              register={register}
              errors={errors}
              checked={getValues("platforms.whatsapp")}
            />
            <UncontrolledCheckbox
              formField={{ name: "platforms.telegram", label: "Telegram" }}
              register={register}
              errors={errors}
              checked={getValues("platforms.telegram")}
            />
            <UncontrolledCheckbox
              formField={{ name: "platforms.discord", label: "Discord" }}
              register={register}
              errors={errors}
              checked={getValues("platforms.discord")}
            />
            <UncontrolledCheckbox
              formField={{ name: "platforms.facebook", label: "Facebook" }}
              register={register}
              errors={errors}
              checked={getValues("platforms.facebook")}
            />
            <UncontrolledCheckbox
              formField={{ name: "platforms.reddit", label: "Reddit" }}
              register={register}
              errors={errors}
              checked={getValues("platforms.reddit")}
            />
            <UncontrolledCheckbox
              formField={{ name: "platforms.linkedin", label: "Linkedin" }}
              register={register}
              errors={errors}
              checked={getValues("platforms.linkedin")}
            />
          </section>
        </div>
      </div>
    </aside>
  )
}

export default Filters
