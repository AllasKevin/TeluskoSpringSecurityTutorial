import axios, {CanceledError} from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;

export default axios.create({
    baseURL: baseURL,
    withCredentials: true,
})

export {CanceledError};