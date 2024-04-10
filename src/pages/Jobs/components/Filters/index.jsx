import { useFormContext } from "react-hook-form"
import { PlusCircle } from "lucide-react"

// Services
import { listProfessionalArea } from "../../../../services/professionalAreaService"

// Components
import Button from "../../../../components/Button"
import UncontrolledCheckbox from "../../../../components/UncontrolledCheckbox"
import UncontrolledSelectDefault from "../../../../components/UncontrolledSelectDefault"

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

function Filters({ onNavigate, hasVacancyButton = false }) {
  const {
    register,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useFormContext()

  return (
    <aside className="jobs__filters">
      {hasVacancyButton && (
        <Button
          styleType="contained"
          style={{ gap: "8px" }}
          rightIcon={<PlusCircle size={18} />}
          onClick={onNavigate}
        >
          Cadastrar vaga
        </Button>
      )}
      <header>
        <h2>Filtros</h2>
        <Button style={buttonStyle} onClick={() => reset()}>
          Limpar filtros
        </Button>
      </header>
      <div className="jobs__filters__separator" />
      <div className="jobs__filters__sections-container">
        <section className="jobs__filters__format">
          <header>
            <h3>Formato</h3>
            <Button
              style={buttonStyle}
              onClick={() =>
                setValue("typeLocation", {
                  remote: false,
                  onsite: false,
                  hybrid: false,
                })
              }
            >
              Limpar
            </Button>
          </header>
          <UncontrolledCheckbox
            formField={{ name: "typeLocation.remote", label: "Remoto" }}
            register={register}
            errors={errors}
            checked={getValues("typeLocation.remote")}
          />
          <UncontrolledCheckbox
            formField={{ name: "typeLocation.onsite", label: "Presencial" }}
            register={register}
            errors={errors}
            checked={getValues("typeLocation.onsite")}
          />
          <UncontrolledCheckbox
            formField={{ name: "typeLocation.hybrid", label: "Híbrido" }}
            register={register}
            errors={errors}
            checked={getValues("typeLocation.hybrid")}
          />
        </section>
        <section className="jobs__filters__type">
          <header>
            <h3>Tipo de emprego</h3>
            <Button
              style={buttonStyle}
              onClick={() => setValue("employmentType", "")}
            >
              Limpar
            </Button>
          </header>
          <UncontrolledSelectDefault
            getValues={getValues}
            setValue={setValue}
            formField={{
              name: "employmentType",
              withoutLabel: true,
              hasTransparent: true,
              options: [
                { value: "fullTime", label: "Tempo integral" },
                { value: "partTime", label: "Meio período" },
                { value: "autonomous", label: "Autônomo" },
                { value: "internship", label: "Estágio" },
                { value: "freelancer", label: "Freelancer" },
                { value: "temporary", label: "Temporário" },
                { value: "trainee", label: "Trainee" },
                { value: "apprentice", label: "Aprendiz" },
                { value: "volunteer", label: "Voluntário" },
                { value: "outsourced", label: "Terceirizado" },
              ],
            }}
            errors={errors}
          />
        </section>
        <section className="jobs__filters__experience-level">
          <header>
            <h3>Área profissional</h3>
            <Button
              style={buttonStyle}
              onClick={() => setValue("occupationArea", "")}
            >
              Limpar
            </Button>
          </header>
          <UncontrolledSelectDefault
            getValues={getValues}
            setValue={setValue}
            getOprions
            formField={{
              name: "occupationArea",
              options: [],
              route: "/list",
              withoutLabel: true,
              hasTransparent: true,
              getOptions: listProfessionalArea,
            }}
            errors={errors}
          />
        </section>
        <section className="jobs__filters__origin">
          <header>
            <h3>Tipo de contrato</h3>
            <Button
              style={buttonStyle}
              onClick={() =>
                setValue("contractType", {
                  clt: false,
                  pj: false,
                  internship: false,
                })
              }
            >
              Limpar
            </Button>
          </header>
          <UncontrolledCheckbox
            formField={{ name: "contractType.clt", label: "CLT" }}
            register={register}
            errors={errors}
            checked={getValues("contractType.clt")}
          />
          <UncontrolledCheckbox
            formField={{
              name: "contractType.pj",
              label: "PJ",
            }}
            register={register}
            errors={errors}
            checked={getValues("contractType.pj")}
          />
          <UncontrolledCheckbox
            formField={{
              name: "contractType.internship",
              label: "Contrato de estágio",
            }}
            register={register}
            errors={errors}
            checked={getValues("contractType.internship")}
          />
        </section>
      </div>
    </aside>
  )
}

export default Filters
