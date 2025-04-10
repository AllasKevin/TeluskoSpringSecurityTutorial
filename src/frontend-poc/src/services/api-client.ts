import axios, {CanceledError} from "axios";

export default axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
})

export {CanceledError};