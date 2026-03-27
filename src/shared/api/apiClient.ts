import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      axios.isAxiosError(error) && error.response?.data?.message
        ? (error.response.data.message as string)
        : error instanceof Error
          ? error.message
          : 'An unexpected error occurred'

    return Promise.reject(new Error(message))
  },
)

export default apiClient
