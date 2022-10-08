import axios from "axios"

const baseUrl = "https://hartono-s.herokuapp.com/"
export const apiUrl = "https://hartono-s.herokuapp.com/api/"


// const baseUrl = "http://localhost:3000/"
// export const apiUrl = "http://localhost:4000/api/"

export const axiosInstance = axios.create({
    baseURL: baseUrl
})
