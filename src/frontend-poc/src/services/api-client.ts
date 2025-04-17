import axios, {CanceledError} from "axios";

export default axios.create({
    baseURL: "https://192.168.0.110",
    withCredentials: true,
})

export {CanceledError};