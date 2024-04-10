import axios from "axios"
import { refreshToken } from "./authServices"

export const BASE_URL = import.meta.env.VITE_BASE_URL

export const apiPublic = axios.create({
  baseURL: BASE_URL,
})

export const apiPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

apiPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Config = configurações da requisição que acabou de ser feita
    const originalRequest = error?.config

    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token
            return apiPrivate.request(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      try {
        isRefreshing = true
        const newAccessToken = await refreshToken()
        if (apiPrivate) {
          apiPrivate.defaults.headers[
            "Authorization"
          ] = `Bearer ${newAccessToken}`
        }
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`

        processQueue(null, newAccessToken)
        return apiPrivate(originalRequest) // Mesma coisa de fazer apiPrivate.request(config)
      } catch (error) {
        localStorage.removeItem("diversiFindUser")
        window.location.pathname = "/login"
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  },
)
