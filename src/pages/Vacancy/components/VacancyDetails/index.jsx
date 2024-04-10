import { useEffect } from "react"
import _ from "lodash"

import "./index.scss"

function VacancyDetails({ data }) {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [])

  return (
    <div className="vacancy-details">
      <section className="vacancy__description">
        <h4>Descrição</h4>
        <p>{data.description}</p>
      </section>
      <section className="vacancy__acessibility">
        <h4>Acessibilidade</h4>
        <div>
          <p>
            As etapas do processo seletivo possuem recursos de acessibilidade
            que atendem as seguintes condições
          </p>
          <ul>
            {data.selectiveProcessAccessibility.map((accessibility) => (
              <li key={accessibility}>{accessibility}</li>
            ))}
          </ul>
        </div>
        <div>
          <p>
            As etapas do processo seletivo possuem recursos de acessibilidade
            que atendem as seguintes condições
          </p>
          <ul>
            {data.jobAccessibility.map((accessibility) => (
              <li key={accessibility}>{accessibility}</li>
            ))}
          </ul>
        </div>

        {!_.isEmpty(data.accommodationAccessibility) && (
          <div>
            <p>
              As acomodações possuem os seguintes recursos de acessibilidade
            </p>
            <ul>
              {data.accommodationAccessibility.map((accessibility) => (
                <li key={accessibility}>{accessibility}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}

export default VacancyDetails
