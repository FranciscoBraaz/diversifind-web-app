import Button from "../../../../components/Button"
import UncontrolledCheckbox from "../../../../components/UncontrolledCheckbox"
import { useFormContext } from "react-hook-form"

const buttonStyle = {
  height: "25px",
  width: "fit-content",
  fontSize: 14,
  lineHeight: "14px",
  padding: "0px",
  border: "none",
  color: "#26a69a",
}

// Stytles
import "./index.scss"

function Filters() {
  const {
    register,
    formState: { errors },
    reset,
  } = useFormContext()

  return (
    <aside className="my-network__filters">
      <header>
        <h5>Filtros</h5>
        <Button style={buttonStyle} onClick={() => reset()}>
          Limpar filtros
        </Button>
      </header>
      <section className="my-network__list-filters">
        <UncontrolledCheckbox
          formField={{ name: "users.followers", label: "Seguidores" }}
          register={register}
          errors={errors}
        />
        <UncontrolledCheckbox
          formField={{ name: "users.following", label: "Seguindo" }}
          register={register}
          errors={errors}
        />
      </section>
    </aside>
  )
}

export default Filters
