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
    let message = 'An unexpected error occurred'

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        message = 'Network error — please check your connection and try again'
      } else if (error.response.data?.message) {
        message = error.response.data.message as string
      } else if (error.response.status === 404) {
        message = 'The requested resource was not found'
      } else if (error.response.status >= 500) {
        message = 'Server error — please try again later'
      }
    } else if (error instanceof Error) {
      message = error.message
    }

    return Promise.reject(new Error(message))
  },
)

export default apiClient
