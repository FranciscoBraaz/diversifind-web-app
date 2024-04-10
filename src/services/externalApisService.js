import axios from "axios"

export async function getCityByStateUf(url) {
  const response = await axios.get(url)
  const citiesFound = response.data.map((city) => ({
    label: city.nome,
    value: city.nome,
  }))

  return citiesFound
}
