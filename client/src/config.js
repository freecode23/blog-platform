import axios from "axios"
export const axiosInstance = axios.create({
    baseURL: "https://hartono-s.herokuapp.com/"
    // baseURL: "http://localhost:3000/"
})