import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ApiError {
  response?: {
    status?: number
    data?: {
      message?: string
    }
  }
  message?: string
}

export function useApiError() {
  const router = useRouter()

  const handleError = (error: unknown, customMessage?: string) => {
    const apiError = error as ApiError

    // Handle 401 Unauthorized - redirect to login
    if (apiError?.response?.status === 401) {
      toast.error("Session expired. Please login again.")
      router.push("/")
      return
    }

    // Handle 403 Forbidden
    if (apiError?.response?.status === 403) {
      toast.error("You don't have permission to perform this action")
      return
    }

    // Handle 404 Not Found
    if (apiError?.response?.status === 404) {
      toast.error("Resource not found")
      return
    }

    // Handle 429 Too Many Requests
    if (apiError?.response?.status === 429) {
      toast.error("Too many requests. Please try again later")
      return
    }

    // Handle 500 Internal Server Error
    if (apiError?.response?.status === 500) {
      toast.error("Server error. Please try again later")
      return
    }

    // Extract error message from response or use custom message
    const errorMessage =
      customMessage ||
      apiError?.response?.data?.message ||
      apiError?.message ||
      "An unexpected error occurred"

    toast.error(errorMessage)
  }

  return { handleError }
}
