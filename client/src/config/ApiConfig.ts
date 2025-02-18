import axios from "axios"
export const backendUrl = "http://localhost:8000"

export const api = axios.create({
  baseURL: `${backendUrl}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

