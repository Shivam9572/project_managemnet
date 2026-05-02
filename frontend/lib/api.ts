import axios from "axios";

export const api = axios.create({
  baseURL:"https://projectmanagemnet-production.up.railway.app", // ✅ fallback hatao
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export function errorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  return "Something went wrong";
}