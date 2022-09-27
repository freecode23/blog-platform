import axios from "axios"

const baseUrl = "http://localhost:3000/"
// const baseUrl = "https://hartono-s.herokuapp.com/"

export const apiUrl = "http://localhost:4000/api/"
// export const apiUrl = "https://hartono-s.herokuapp.com/api/"

export const axiosInstance = axios.create({
    baseURL: baseUrl
})
